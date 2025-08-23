-- Este script es para la configuración inicial de la base de datos en Supabase.
-- Incluye la creación de tablas y la configuración de Row Level Security (RLS).

-- Tabla de usuarios (ya manejada por Supabase Auth, pero se puede extender)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name text,
    business_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS para la tabla de usuarios
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver y actualizar su propio perfil
CREATE POLICY "Users can view their own profile." ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.users FOR UPDATE USING (auth.uid() = id);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10, 2) NOT NULL,
    stock integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS para la tabla de productos
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Políticas para productos (solo el propietario puede CRUD)
CREATE POLICY "Owners can create products." ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can view their products." ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can update their products." ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their products." ON public.products FOR DELETE USING (auth.uid() = user_id);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS public.sales (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    sale_date timestamp with time zone DEFAULT now() NOT NULL,
    total_amount numeric(10, 2) NOT NULL,
    payment_method text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS para la tabla de ventas
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Políticas para ventas
CREATE POLICY "Owners can create sales." ON public.sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can view their sales." ON public.sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can update their sales." ON public.sales FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their sales." ON public.sales FOR DELETE USING (auth.uid() = user_id);

-- Tabla de detalles de venta (items de cada venta)
CREATE TABLE IF NOT EXISTS public.sale_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    sale_id uuid REFERENCES public.sales ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products ON DELETE CASCADE NOT NULL,
    quantity integer NOT NULL,
    price_at_sale numeric(10, 2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS para la tabla de detalles de venta
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Políticas para detalles de venta (dependen de la venta principal)
CREATE POLICY "Owners can create sale items." ON public.sale_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_items.sale_id AND sales.user_id = auth.uid()));
CREATE POLICY "Owners can view their sale items." ON public.sale_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_items.sale_id AND sales.user_id = auth.uid()));
CREATE POLICY "Owners can update their sale items." ON public.sale_items FOR UPDATE USING (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_items.sale_id AND sales.user_id = auth.uid()));
CREATE POLICY "Owners can delete their sale items." ON public.sale_items FOR DELETE USING (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_items.sale_id AND sales.user_id = auth.uid()));

-- Tabla de gastos
CREATE TABLE IF NOT EXISTS public.expenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    expense_date timestamp with time zone DEFAULT now() NOT NULL,
    description text NOT NULL,
    amount numeric(10, 2) NOT NULL,
    category text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS para la tabla de gastos
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Políticas para gastos
CREATE POLICY "Owners can create expenses." ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can view their expenses." ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can update their expenses." ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their expenses." ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Tabla de movimientos de caja (arqueo)
CREATE TABLE IF NOT EXISTS public.cash_register_movements (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    movement_date timestamp with time zone DEFAULT now() NOT NULL,
    type text NOT NULL, -- 'initial_balance', 'deposit', 'withdrawal', 'closing_balance'
    amount numeric(10, 2) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS para la tabla de movimientos de caja
ALTER TABLE public.cash_register_movements ENABLE ROW LEVEL SECURITY;

-- Políticas para movimientos de caja
CREATE POLICY "Owners can create cash movements." ON public.cash_register_movements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can view their cash movements." ON public.cash_register_movements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can update their cash movements." ON public.cash_register_movements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their cash movements." ON public.cash_register_movements FOR DELETE USING (auth.uid() = user_id);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    contact_person text,
    phone text,
    email text,
    address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS para la tabla de proveedores
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Políticas para proveedores
CREATE POLICY "Owners can create suppliers." ON public.suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can view their suppliers." ON public.suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can update their suppliers." ON public.suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their suppliers." ON public.suppliers FOR DELETE USING (auth.uid() = user_id);

-- Tabla de canchas (courts)
CREATE TABLE IF NOT EXISTS public.courts (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    price_per_hour numeric(10, 2) NOT NULL,
    is_active boolean DEFAULT TRUE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS para la tabla de canchas
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;

-- Políticas para canchas
CREATE POLICY "Owners can create courts." ON public.courts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can view their courts." ON public.courts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can update their courts." ON public.courts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their courts." ON public.courts FOR DELETE USING (auth.uid() = user_id);

-- Tabla de reservas (bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    court_id uuid REFERENCES public.courts ON DELETE CASCADE NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    customer_name text,
    customer_phone text,
    total_price numeric(10, 2) NOT NULL,
    status text NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT check_start_end_time CHECK (end_time > start_time)
);

-- Habilitar RLS para la tabla de reservas
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Políticas para reservas
CREATE POLICY "Owners can create bookings." ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can view their bookings." ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can update their bookings." ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete their bookings." ON public.bookings FOR DELETE USING (auth.uid() = user_id);
