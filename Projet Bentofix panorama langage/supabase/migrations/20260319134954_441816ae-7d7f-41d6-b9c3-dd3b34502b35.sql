
CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro');

ALTER TABLE public.profiles
ADD COLUMN subscription_tier subscription_tier NOT NULL DEFAULT 'free';
