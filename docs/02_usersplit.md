# Přidání uživatelů

## Vstupní soubory

1. **usersFile**:
   Tento soubor obsahuje řádky, z nichž každý reprezentuje jednoho uživatele. Každý řádek by měl mít následující informace oddělené mezerou:

    - `skupina`: Název skupiny, ke které bude uživatel patřit.
    - `admin`: Uživatelské jméno administrátora této skupiny. Pokud administrátor s tímto jménem již existuje v databázi, bude použit. V opačném případě bude vytvořen nový administrátor.
    - `username`: Uživatelské jméno nově vytvořeného uživatele.
    - `heslo`: Heslo pro nově vytvořeného uživatele. Hesla jsou předpokládána ve stejném pořadí jako řádky v `passwordsFile`.

2. **passwordsFile**:
    Tento soubor obsahuje hesla pro administrátory. Hesla musí být na samostatných řádcích.

    Musí zde být minimálně tolik hesel, kolik bude administrátorů

3. **superadminFile**:
    Tento soubor obsahuje heslo superadmina


## Výstupní soubory

1. **admins**
    Tento soubor obsahuje řádky, z nichž každý reprezentuje jednoho uživatele a jeho heslo.



## Spuštění
### Navigace do adresáře se scriptem

```
cd packages/usersplit/
```

### Vytvoření .env

Ke spuštění scriptu je potřeba .env s DATABASE_URL proměnnou

```
echo "DATABASE_URL=postgres://REDACTED:REDACTED@localhost:5432/postgres" > .env
```

### Instalace závislostí a spuštění

```
pnpm install && pnpm run main -u <Cesta k usersFile> -p <Cesta k passwordsFile> -s <Cesta k superadminFile> -o <Cesta k výstupnímu souboru admins>
```

