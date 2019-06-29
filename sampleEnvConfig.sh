# THIS IS SAMPLE ENVCONFIG. CREATE 'envconfig.sh' FOR ACTUAL USE.

export APP_NAME="MY_APP"

#----CORE-FEATURES
export ${APP_NAME}_FEATURES_IS_HTTPS=false

#----SERVER
export ${APP_NAME}_ENV="dev"
export ${APP_NAME}_PORT="4001"
export ${APP_NAME}_BIND_IP="127.0.0.1"

# export ${APP_NAME}_HTTPS_KEY=""
# export ${APP_NAME}_HTTPS_CERT=""
export ${APP_NAME}_LOGGER_LEVEL="info"
