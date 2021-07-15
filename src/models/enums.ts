export enum ERROR {
  AWS_EVENT_EMPTY = "AWS event is empty. Check your test event.",
  NOT_VALID_JSON = "Body is not a valid JSON.",
  INVALID_PAYLOAD = "Invalid Payload",
  INVALID_PATH_PARAM = "Invalid Path Parameters",
  NO_UNIQUE_TARGET = "Unable to determine unique target",
  SECRET_STRING_EMPTY = "SecretString is empty.",
  SECRET_ENV_VAR_NOT_SET = "SECRET_NAME environment variable not set.",
  FUNCTION_CONFIG_NOT_DEFINED = "Functions were not defined in the config file.",
}

export enum CHANGE {
  UPDATE = "UPDATE",
  CREATE = "CREATE",
  DELETE = "DELETE",
}

export enum TARGET {
  TEST_STATIONS = "test-stations",
}
