create function public.handle_new_user() 
returns trigger
language plpgsql
security definer 
set search_path = ''
as $$
begin
    insert into public.user_profiles (id, name, account_type) -- Updated to match your table!
    values (
        new.id, 
        new.raw_user_meta_data->>'name', 
        new.raw_user_meta_data->>'role' -- Keep this as 'role' since that's what we named it in Singup.jsx
    );
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row 
    execute function public.handle_new_user(); -- Use 'function' here for better compatibility
