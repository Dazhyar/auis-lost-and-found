import requests as http_requests

def authenticate_google_user(access_token, credential):
    """
    Validates Google tokens and returns user info dictionary or an error dict.
    Returns: (user_info_dict, error_dict)
    """
    if not access_token and not credential:
        return None, {'error': 'No authentication token provided', 'status': 400}

    # 1. Access Token Flow (Pop-up Custom Login)
    if access_token:
        verify_url = f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}'
        resp = http_requests.get(verify_url, timeout=10)
        if resp.status_code != 200:
            return None, {'error': 'Invalid Google Access Token', 'status': 401}
        info = resp.json()
    # 2. ID Token Flow (Standard Google Login button)
    else:
        verify_url = f'https://oauth2.googleapis.com/tokeninfo?id_token={credential}'
        resp = http_requests.get(verify_url, timeout=10)
        if resp.status_code != 200:
            return None, {'error': 'Invalid Google ID Token', 'status': 401}
        info = resp.json()

    # ⚠️ DEV MODE: AUIS domain restriction disabled for testing.
    # Re-enable for production by uncommenting the lines below:
    # email = info.get('email', '')
    # if not email.endswith('@auis.edu.krd'):
    #     return None, {'error': 'Only AUIS email addresses (@auis.edu.krd) are allowed.', 'status': 403}

    return {
        'email': info.get('email', ''),
        'google_id': info.get('sub'),
        'full_name': info.get('name', ''),
        'photo_url': info.get('picture', '')
    }, None
