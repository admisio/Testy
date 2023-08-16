# Spuštění

## Vytvoření docker sítě

```
docker network create -d bridge traefik_proxy
```

## Traefik

```
docker compose -f docker/traefik/docker-compose.yml up
```

Traefik běží na portu 80

## Testy

### Přihlášení

Použijte `docker login` se svými přihlašovacími údaji

```
docker login
```

### Spuštění

Nakonfigurujte šablonu: `docker/testy/docker-compose.yml` a spusťte ji

```
docker compose -f docker/testy/docker-compose.yml up
```

 - Migrace se spustí automaticky