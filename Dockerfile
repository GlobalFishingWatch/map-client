#################################################################################
# Step to build the application assets
#################################################################################
FROM node:12 AS build
RUN mkdir -p /app
WORKDIR /app

# Config build args
ARG PUBLIC_URL=/
ARG LITERALS_FILE=dev.json
ARG DEFAULT_WORKSPACE=default-map-client-3-0-workspace-dev
ARG REACT_APP_FEATURE_FLAG_SUBSCRIPTIONS=true
ARG REACT_APP_FEATURE_TRANSLATIONS=true
ARG REACT_APP_COMPLETE_MAP_RENDER=true
ARG REACT_APP_DISABLE_WELCOME_MODAL=false
ARG REACT_APP_REQUIRE_MAP_LOGIN=false
ARG REACT_APP_SHOW_BANNER=false
ARG REACT_APP_WELCOME_MODAL_COOKIE_KEY=welcome_pop_up_v6
ARG REACT_APP_TIMEBAR_DATA_URL=https://storage.googleapis.com/world-fishing-827/pelagos/data/vizzuality-map-resources/timebar
ARG REACT_APP_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org
ARG REACT_APP_SITE_URL=http://globalfishingwatch.org/
ARG REACT_APP_MAP_URL=http://globalfishingwatch.org/map
ARG REACT_APP_SHARE_BASE_URL=https://globalfishingwatch.org/map/workspace/{workspace_id}
ARG REACT_APP_GOOGLE_TAG_MANAGER_KEY


# Install build dependencies
COPY . /app
RUN cp /app/literals/${LITERALS_FILE} /app/public/literals.json
ENV NODE_ENV=development
ENV NODE_PATH=src
ENV PUBLIC_URL=${PUBLIC_URL}
ENV DEFAULT_WORKSPACE=${DEFAULT_WORKSPACE}
ENV REACT_APP_FEATURE_FLAG_SUBSCRIPTIONS=${REACT_APP_FEATURE_FLAG_SUBSCRIPTIONS}
ENV REACT_APP_FEATURE_TRANSLATIONS=${REACT_APP_FEATURE_TRANSLATIONS}
ENV REACT_APP_COMPLETE_MAP_RENDER=${REACT_APP_COMPLETE_MAP_RENDER}
ENV REACT_APP_DISABLE_WELCOME_MODAL=${REACT_APP_DISABLE_WELCOME_MODAL}
ENV REACT_APP_REQUIRE_MAP_LOGIN=${REACT_APP_REQUIRE_MAP_LOGIN}
ENV REACT_APP_SHOW_BANNER=${REACT_APP_SHOW_BANNER}
ENV REACT_APP_WELCOME_MODAL_COOKIE_KEY=${REACT_APP_WELCOME_MODAL_COOKIE_KEY}
ENV REACT_APP_TIMEBAR_DATA_URL=${REACT_APP_TIMEBAR_DATA_URL}
ENV REACT_APP_API_GATEWAY=${REACT_APP_API_GATEWAY}
ENV REACT_APP_SITE_URL=${REACT_APP_SITE_URL}
ENV REACT_APP_MAP_URL=${REACT_APP_MAP_URL}
ENV REACT_APP_SHARE_BASE_URL=${REACT_APP_SHARE_BASE_URL}
ENV REACT_APP_GOOGLE_TAG_MANAGER_KEY=${REACT_APP_GOOGLE_TAG_MANAGER_KEY}
RUN npm install --unsafe-perm

# Build the application assets
ENV NODE_ENV=production
RUN npm run build

#################################################################################
# Actual application to run
#################################################################################
FROM nginx
ARG BASIC_AUTH_USER=gfw
ARG BASIC_AUTH_PASS=default

RUN apt-get update && apt-get install openssl -y

COPY nginx/nginx.conf /etc/nginx/nginx.template
RUN echo -n ${BASIC_AUTH_USER}: >> /etc/nginx/.htpasswd
RUN echo ${BASIC_AUTH_PASS} | openssl passwd -apr1 -stdin >> /etc/nginx/.htpasswd
COPY entrypoint.sh entrypoint.sh
COPY --from=build /app/build/ /usr/share/nginx/www/
ENTRYPOINT ["./entrypoint.sh"]
