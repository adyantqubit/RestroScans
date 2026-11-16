import contextvars

_actor = contextvars.ContextVar('restroscans_actor', default='system')


def set_actor(actor):
    _actor.set(actor or 'system')


def get_actor():
    return _actor.get()


def clear_actor():
    _actor.set('system')
