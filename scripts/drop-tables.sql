-- Eliminar tablas existentes si ya existen (para un reinicio limpio)
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.courts CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.cash_register_movements CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.sale_items CASCADE;
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Eliminar funciones y triggers existentes si ya existen
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_sale_item_insert ON public.sale_items CASCADE;
DROP FUNCTION IF EXISTS public.update_stock_on_sale() CASCADE;
DROP TRIGGER IF EXISTS on_sale_item_delete ON public.sale_items CASCADE;
DROP FUNCTION IF EXISTS public.revert_stock_on_sale_item_delete() CASCADE;
DROP TRIGGER IF EXISTS on_sale_item_update ON public.sale_items CASCADE;
DROP FUNCTION IF EXISTS public.adjust_stock_on_sale_item_update() CASCADE;
