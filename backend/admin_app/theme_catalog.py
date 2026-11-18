"""Built-in customer-menu themes for the platform AppTheme table.

These five rows are ensured by migration (and seed_demo). Platform admins
can create additional AppTheme rows in Django admin at any time; this
catalog only inserts missing defaults and does not overwrite custom edits.
"""

DEFAULT_THEMES = (
    {
        # Soft hotel-menu palette (closer to live Ashish-style clarity).
        'background_color_label': 'Spice Cream',
        'heading_color_label': 'Warm Brown',
        'background_color': '#FBF6F0',
        'heading_color': '#5C4033',
        'subheading_color': '#2F241C',
        'banner_heading_color': '#A65D3F',
        'heading_bgcolor': '#8B5E3C',
        'subheading_bgcolor': '#F3E6D8',
        'card_color': '#FFFFFF',
    },
    {
        'background_color_label': 'Forest Pearl',
        'heading_color_label': 'Deep Green',
        'background_color': '#F4FBF6',
        'heading_color': '#1F4D3A',
        'subheading_color': '#2F5D4A',
        'banner_heading_color': '#2F7D5A',
        'heading_bgcolor': '#1F4D3A',
        'subheading_bgcolor': '#D9F0E3',
        'card_color': '#FFFFFF',
    },
    {
        'background_color_label': 'Ocean Mist',
        'heading_color_label': 'Navy',
        'background_color': '#F3F7FB',
        'heading_color': '#163A5F',
        'subheading_color': '#274863',
        'banner_heading_color': '#2F6FA8',
        'heading_bgcolor': '#163A5F',
        'subheading_bgcolor': '#D7E6F4',
        'card_color': '#FFFFFF',
    },
    {
        'background_color_label': 'Amber Slate',
        'heading_color_label': 'Charcoal',
        'background_color': '#F7F5F1',
        'heading_color': '#22262B',
        'subheading_color': '#3C434C',
        'banner_heading_color': '#C28B2A',
        'heading_bgcolor': '#22262B',
        'subheading_bgcolor': '#E8E2D7',
        'card_color': '#FFFFFF',
    },
    {
        'background_color_label': 'Rose Quartz',
        'heading_color_label': 'Wine',
        'background_color': '#FFF5F7',
        'heading_color': '#6D1F3A',
        'subheading_color': '#4A2A34',
        'banner_heading_color': '#B84D6B',
        'heading_bgcolor': '#6D1F3A',
        'subheading_bgcolor': '#F3D8E0',
        'card_color': '#FFFFFF',
    },
)


def ensure_default_themes(AppTheme, refresh_colors=True):
    """Create any missing built-in themes. Returns the first default theme.

    When refresh_colors is True, built-in labels also get catalog color updates
    so demos stay aligned with the platform defaults.
    """
    first = None
    for index, palette in enumerate(DEFAULT_THEMES):
        label = palette['background_color_label']
        theme = AppTheme.objects.filter(background_color_label=label).first()
        if theme is None and index == 0:
            # Older demos used "Warm cream"; keep that row as Spice Cream.
            theme = AppTheme.objects.filter(background_color_label='Warm cream').first()
        if theme is None:
            theme = AppTheme.objects.create(**palette)
        elif refresh_colors:
            for key, value in palette.items():
                setattr(theme, key, value)
            theme.save()
        if first is None:
            first = theme
    return first or AppTheme.objects.order_by('id').first()
