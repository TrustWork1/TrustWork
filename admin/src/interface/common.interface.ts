export enum HttpStatusCode {
  Continue = 100, // Request headers received, client should continue sending body.
  SwitchingProtocols = 101, // Server switching protocols as requested.
  Processing = 102, // WebDAV: Request is being processed but no response yet.
  Ok = 200, // Standard response for successful requests.
  Created = 201, // Resource successfully created.
  Accepted = 202, // Request accepted, processing not complete.
  NonAuthoritativeInformation = 203, // Transformed proxy response.
  NoContent = 204, // Successful request, no content returned.
  ResetContent = 205, // Successful request, requester must reset document view.
  PartialContent = 206, // Partial content due to range header.
  MultiStatus = 207, // WebDAV: Multiple sub-responses.
  AlreadyReported = 208, // WebDAV: Binding already reported.
  ImUsed = 226, // Instance-manipulations applied to the current instance.
  MultipleChoices = 300, // Multiple options for resource.
  MovedPermanently = 301, // Resource moved permanently.
  Found = 302, // Resource found, temporary redirect.
  SeeOther = 303, // Redirect to another URI via GET.
  NotModified = 304, // Resource not modified since last request.
  UseProxy = 305, // Must access resource via proxy.
  TemporaryRedirect = 307, // Temporary redirect, same method.
  PermanentRedirect = 308, // Permanent redirect, same method.
  BadRequest = 400, // Client error, invalid request.
  Unauthorized = 401, // Authentication required or failed.
  PaymentRequired = 402, // Reserved for future use.
  Forbidden = 403, // Request valid but refused.
  NotFound = 404, // Resource not found.
  MethodNotAllowed = 405, // Request method not allowed for resource.
  NotAcceptable = 406, // Resource not acceptable by client headers.
  ProxyAuthenticationRequired = 407, // Proxy authentication required.
  RequestTimeout = 408, // Client took too long to send request.
  Conflict = 409, // Conflict in request, e.g., concurrent updates.
  Gone = 410, // Resource permanently gone.
  LengthRequired = 411, // Content length header required.
  PreconditionFailed = 412, // Request precondition failed.
  PayloadTooLarge = 413, // Request payload too large.
  UriTooLong = 414, // URI too long for server to process.
  UnsupportedMediaType = 415, // Media type not supported.
  RangeNotSatisfiable = 416, // Requested range invalid.
  ExpectationFailed = 417, // Expect header precondition failed.
  IAmATeapot = 418, // Fun HTTP code for teapots.
  MisdirectedRequest = 421, // Request sent to wrong server.
  UnprocessableEntity = 422, // WebDAV: Semantic errors in request.
  Locked = 423, // WebDAV: Resource is locked.
  FailedDependency = 424, // WebDAV: Failed due to earlier request.
  UpgradeRequired = 426, // Switch to a different protocol.
  PreconditionRequired = 428, // Preconditions required for request.
  TooManyRequests = 429, // Rate-limiting: too many requests.
  RequestHeaderFieldsTooLarge = 431, // Request headers too large.
  UnavailableForLegalReasons = 451, // Resource blocked for legal reasons.
  InternalServerError = 500, // Server encountered an error.
  NotImplemented = 501, // Server does not recognize method.
  BadGateway = 502, // Invalid response from upstream server.
  ServiceUnavailable = 503, // Server temporarily unavailable.
  GatewayTimeout = 504, // No timely response from upstream server.
  HttpVersionNotSupported = 505, // HTTP version not supported.
  VariantAlsoNegotiates = 506, // Transparent content negotiation loop.
  InsufficientStorage = 507, // WebDAV: Insufficient storage.
  LoopDetected = 508, // WebDAV: Infinite loop detected.
  NotExtended = 510, // Further extensions required.
  NetworkAuthenticationRequired = 511 // Network authentication required.
}

export type StatusCodes = `${Extract<HttpStatusCode, number>}` extends `${infer N extends number}` ? N : never

export interface BaseApiResponse {
  status: StatusCodes
  message: string
  type?: string
  token?: string
  data?: Record<string, string[]>
}

export interface BaseListApiResponse {
  totalPageCount: number
  totalCount: number
  currentPage: number
  currentLimit: number
  post_image_path?: string
  user_image_path?: string
  comment_image_path?: string
  company_image_path?: string
  resume_file_path?: string
}
