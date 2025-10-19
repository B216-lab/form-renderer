# Apache Superset Docker image with PostgreSQL driver

```bash
echo "SECRET_KEY = '$(openssl rand -base64 42)'" > superset_config.py
docker build -t mysuperset:latest .
```

> Check version of documentation

- [Building your own production Docker image](https://superset.apache.org/docs/installation/docker-builds#building-your-own-production-docker-image)
- [Configuring Superset](https://superset.apache.org/docs/configuration/configuring-superset)
- *Superset's metadata database* - database to store the information it manages, like the definitions of charts, dashboards, and many other things