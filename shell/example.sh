#!/bin/bash
export BASE_URL="http://localhost:3001"
export NODE_ENV="development"
export LOGGING_LEVEL="error"

#opsgenie
export OPSGENIE_KEY="OPSGENIE_KEY"
export PRISMIC_URL="https://keno.prismic.io/api"

export APP_NAME="Keno APP"

#newrelic
export NEW_RELIC_LICENSE_KEY="NEW_RELIC_LICENSE_KEY"
export NEW_RELIC_APP_NAME=$APP_NAME
export NEW_RELIC_ENABLED="false"

#cors
export CORS_ORIGINS="*"
