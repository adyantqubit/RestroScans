from ..models import Item


def getBestproduct():
    """Items the restaurant has marked as best sellers, as ``[{"item": id}, ...]``."""
    return [{'item': pk} for pk in Item.objects.filter(best_seller=True).order_by('id').values_list('id', flat=True)]
