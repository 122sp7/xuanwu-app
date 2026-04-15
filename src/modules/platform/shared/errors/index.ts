export class PlatformConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlatformConfigurationError";
  }
}

export class PlatformAuthorizationError extends Error {
  constructor(message = "Platform access denied.") {
    super(message);
    this.name = "PlatformAuthorizationError";
  }
}

export class PlatformResourceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlatformResourceNotFoundError";
  }
}
