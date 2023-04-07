"""
Created by - Ashish Dewangan on 08-02-2023
Reason - To have custom middleware that will trap the request and find the tenant schema from that request
"""

from tenant_schemas.middleware import BaseTenantMiddleware
from .models import *

class MutitenantMiddleware(BaseTenantMiddleware):
    def get_tenant(self, model, hostname, request):

        print("path -----",request.path)
        print("hostname -----",hostname)
      
        path=request.path

        if "media" in path:
            from tenant_schemas.utils import get_public_schema_name
            return Tenant.objects.get(schema_name=get_public_schema_name())
        
        if "favicon" in path:
            from tenant_schemas.utils import get_public_schema_name
            return Tenant.objects.get(schema_name=get_public_schema_name())
        
        if "admin" in path:
            from django.conf import settings
            seperated=hostname.split('.')
            # schemaName="public"
            schemaName=settings.PUBLIC_SCHEMA_NAME
            # if seperated[0] !="moreshop":
            if seperated[0] != settings.DOMAIN_NAME :
                schemaName=seperated[0]
            print("admin side schema name-----",schemaName)    
            return Tenant.objects.get(schema_name=schemaName)

        else:
            import re
            from django.conf import settings
            print("extracted path-----",path[(re.search("v1",path).end()+1):len(path)])
            splitedPath=path[(re.search("v1",path).end()+1):len(path)]
            splitedWords=splitedPath.split('/')
            print("splited words-----",splitedWords)
            print("extracted schema name-----",splitedWords[0])
            # schemaName="public"
            schemaName=settings.PUBLIC_SCHEMA_NAME
            # if splitedWords[0] !="moreshop":
            if splitedWords[0] != settings.DOMAIN_NAME :
                schemaName=splitedWords[0]
            return Tenant.objects.get(schema_name=schemaName)
        

        # if "/api/v1/" in path:
        #     import re
        #     from django.conf import settings
        #     print("extracted path-----",path[(re.search("v1",path).end()+1):len(path)])
        #     splitedPath=path[(re.search("v1",path).end()+1):len(path)]
        #     splitedWords=splitedPath.split('/')
        #     print("splited words-----",splitedWords)
        #     print("extracted schema name-----",splitedWords[0])
        #     # schemaName="public"
        #     schemaName=settings.PUBLIC_SCHEMA_NAME
        #     # if splitedWords[0] !="moreshop":
        #     if splitedWords[0] != settings.DOMAIN_NAME :
        #         schemaName=splitedWords[0]
        #     return Tenant.objects.get(schema_name=schemaName)

        # else:
        #     from django.conf import settings
        #     seperated=hostname.split('.')
        #     # schemaName="public"
        #     schemaName=settings.PUBLIC_SCHEMA_NAME
        #     # if seperated[0] !="moreshop":
        #     if seperated[0] != settings.DOMAIN_NAME :
        #         # schemaName=seperated[0]
        #         pass
        #     print("admin side schema name-----",schemaName)
        #     return Tenant.objects.get(schema_name=schemaName)