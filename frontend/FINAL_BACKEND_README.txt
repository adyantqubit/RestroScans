RestroScans Backend - Final Clean Structure

Final tenant_app flow:
urls.py -> views/ -> services/ -> repositories/ -> models.py / DB

Key cleanup included:
- tenant_app/models.py contains model declarations/fields only; no def methods.
- tenant_app/serializers.py cleaned and explicit model imports used.
- old tenant_app/views.py bridge removed.
- old tenant_app/modules/ removed; API modules live in tenant_app/views/.
- services/, repositories/, utils/ retained as separated layers.
- existing migrations retained unchanged.
- existing admin_app and backend configuration retained.

Validation performed while packaging:
- Python compileall passed for backend/, admin_app/, tenant_app/.
- No stale tenant_app.modules imports found.
- URL API classes referenced through .as_view() were checked against tenant_app/views/.
- No database schema edits were intentionally introduced by this packaging step.

Known existing Django warning:
tenant_app.OfferItem.item_name W342 (ForeignKey(unique=True) behaves like OneToOneField).
This was intentionally not changed because it is a schema change.

After replacing the backend, activate the existing venv and run:
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py runserver 0.0.0.0:8000

Expected migration check: No changes detected.
