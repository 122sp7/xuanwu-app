/**
 * buildExternalDeliveryRequest — External Delivery Request Builder
 *
 * Constructs the protocol-specific request payload for an external delivery
 * (webhook, HTTP call, queue message) from a domain-typed dispatch input.
 *
 * Responsibility:
 *   - Translate IntegrationContract delivery config + signal payload → protocol request
 *   - Apply serialisation rules for the target protocol (JSON body, headers, signing)
 *
 * @see adapters/external/dispatchExternalDelivery.ts — sends the built request
 * @see domain/aggregates/IntegrationContract.ts
 * @see ports/output/index.ts — ExternalSystemGateway
 */

// TODO: implement buildExternalDeliveryRequest request builder
