"""Resolve a restaurant tenant from the request host.

The subdomain is the tenant. ``tenant1.restroscans.com`` selects schema ``tenant1``.
The API path does not need a tenant segment.
"""

LOCAL_HOSTS = {'localhost', '127.0.0.1', '0.0.0.0', '::1'}


def tenant_cache_key(slug):
    return f'tenant-by-slug:{slug}'


def hostname_without_port(hostname):
    if not hostname:
        return ''
    host = hostname.strip().lower().rstrip('.')
    if host.startswith('['):
        return host
    return host.split(':', 1)[0]


def is_local_host(hostname):
    return hostname_without_port(hostname) in LOCAL_HOSTS


def is_private_address(hostname):
    """True for loopback and LAN addresses. A public name is not one of these."""
    host = hostname_without_port(hostname)
    if host in LOCAL_HOSTS:
        return True
    parts = host.split('.')
    if len(parts) != 4 or not all(part.isdigit() for part in parts):
        return False
    numbers = [int(part) for part in parts]
    if any(number > 255 for number in numbers):
        return False
    first, second = numbers[0], numbers[1]
    return first == 10 or (first == 192 and second == 168) or (first == 172 and 16 <= second <= 31)


def tenant_slug_from_host(hostname, base_domain='restroscans.com'):
    """Return the tenant slug carried by the host, or None for the public host.

    tenant1.restroscans.com -> tenant1
    www.restroscans.com -> None
    restroscans.com -> None
    tenant1.localhost -> tenant1
    localhost -> None
    """
    host = hostname_without_port(hostname)
    if not host or host in LOCAL_HOSTS:
        return None

    parts = host.split('.')
    if len(parts) == 2 and parts[1] == 'localhost' and parts[0] not in ('www', ''):
        return parts[0]

    base = (base_domain or 'restroscans.com').strip().lower().rstrip('.')
    if host == base or host == f'www.{base}':
        return None
    suffix = f'.{base}'
    if host.endswith(suffix):
        label = host[: -len(suffix)]
        if label and label != 'www' and '.' not in label:
            return label
    return None
