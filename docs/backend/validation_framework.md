# Universal Validation Engine

## Overview
Built on top of `Zod`, the `UniversalValidator` ensures strict payload, parameter, and header validation.

## Usage
All requests are validated at the middleware layer or within the Application Service. When validation fails, a `ValidationError` is thrown, which the `globalErrorHandler` catches and formats into the standard `ResponseDTO` structure with `400 Bad Request`.
