ARG ELASTIC_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/kibana/kibana:${ELASTIC_VERSION}
COPY ./config/kibana.yml /usr/share/kibana/config/kibana.yml

# Add your kibana plugins setup here
# Example: RUN kibana-plugin install <name|url>
