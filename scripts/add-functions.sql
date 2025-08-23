-- Trigger para crear un perfil de usuario en la tabla 'users' cuando se registra un nuevo usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, business_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'business_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar el stock después de una venta
CREATE OR REPLACE FUNCTION public.update_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_sale_item_insert ON public.sale_items;
CREATE TRIGGER on_sale_item_insert
AFTER INSERT ON public.sale_items
FOR EACH ROW EXECUTE FUNCTION public.update_stock_on_sale();

-- Función para revertir el stock si se elimina un item de venta
CREATE OR REPLACE FUNCTION public.revert_stock_on_sale_item_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET stock = stock + OLD.quantity
    WHERE id = OLD.product_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_sale_item_delete ON public.sale_items;
CREATE TRIGGER on_sale_item_delete
AFTER DELETE ON public.sale_items
FOR EACH ROW EXECUTE FUNCTION public.revert_stock_on_sale_item_delete();

-- Función para ajustar el stock si se actualiza la cantidad de un item de venta
CREATE OR REPLACE FUNCTION public.adjust_stock_on_sale_item_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantity <> OLD.quantity THEN
        UPDATE public.products
        SET stock = stock - (NEW.quantity - OLD.quantity)
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_sale_item_update ON public.sale_items;
CREATE TRIGGER on_sale_item_update
AFTER UPDATE ON public.sale_items
FOR EACH ROW EXECUTE FUNCTION public.adjust_stock_on_sale_item_update();

-- Asegurar que la función se ejecuta como el usuario que la llama
ALTER FUNCTION public.handle_new_user() SET SEARCH_PATH TO public, auth, pg_temp;
ALTER FUNCTION public.update_stock_on_sale() SET SEARCH_PATH TO public, auth, pg_temp;
ALTER FUNCTION public.revert_stock_on_sale_item_delete() SET SEARCH_PATH TO public, auth, pg_temp;
ALTER FUNCTION public.adjust_stock_on_sale_item_update() SET SEARCH_PATH TO public, auth, pg_temp;

-- Otorgar permisos de ejecución a la función para el rol 'anon' y 'authenticated'
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_stock_on_sale() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.revert_stock_on_sale_item_delete() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_stock_on_sale_item_update() TO anon, authenticated;
