def normalize_mtn_cameroon_msisdn(phone_number):
    digits = "".join(ch for ch in str(phone_number or "") if ch.isdigit())
    if digits.startswith("00"):
        digits = digits[2:]
    if digits.startswith("237") and len(digits) > 9:
        digits = digits[3:]
    if len(digits) != 9 or not digits.startswith("6"):
        raise ValueError("Use a valid Cameroon MTN number, e.g. 2376XXXXXXXX.")
    return f"237{digits}"


def mtn_failure_message(reason):
    reason = str(reason or "").strip().upper()
    messages = {
        "PAYER_NOT_FOUND": "The MTN MoMo payer account was not found or is not active.",
        "PAYEE_NOT_FOUND": "The MTN MoMo payee account was not found or is not active.",
        "NOT_ENOUGH_FUNDS": "The MTN MoMo account does not have enough funds.",
        "LOW_BALANCE_OR_PAYEE_LIMIT_REACHED_OR_NOT_ALLOWED": (
            "The MTN MoMo payment could not be completed because the payer balance "
            "is low, a transaction limit was reached, or the wallet is not allowed "
            "for this payment."
        ),
        "COULD_NOT_PERFORM_TRANSACTION": "MTN could not perform the transaction. Ask the customer to approve the prompt, check balance/limits, and retry.",
        "INTERNAL_PROCESSING_ERROR": "MTN is still processing or returned an internal error. Retry after a short delay.",
    }
    return messages.get(reason, "MTN MoMo transaction failed.")


def is_mtn_account_active(account_status):
    result = (account_status or {}).get("result")
    return result is True or str(result).strip().lower() == "true"
