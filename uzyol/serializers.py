from rest_framework import serializers


class BrandSerializer(serializers.Serializer):
    name = serializers.CharField()
    legalName = serializers.CharField()
    tagline = serializers.CharField()


class AssetsSerializer(serializers.Serializer):
    logo = serializers.URLField(allow_blank=True)
    hero = serializers.URLField(allow_blank=True)
    plant = serializers.URLField(allow_blank=True)
    contact = serializers.URLField(allow_blank=True)
    leaders = serializers.ListField(child=serializers.URLField())


class ContactSerializer(serializers.Serializer):
    phones = serializers.ListField(child=serializers.CharField())
    email = serializers.EmailField(allow_blank=True)
    bank = serializers.CharField()
    address = serializers.CharField()
    hours = serializers.CharField()
    map = serializers.URLField(allow_blank=True)


class NavigationChildSerializer(serializers.Serializer):
    label = serializers.CharField()
    slug = serializers.CharField()


class NavigationItemSerializer(serializers.Serializer):
    label = serializers.CharField()
    slug = serializers.CharField()
    children = NavigationChildSerializer(many=True, required=False)


class HomeSerializer(serializers.Serializer):
    intro = serializers.CharField()
    purpose = serializers.CharField()
    tasks = serializers.ListField(child=serializers.CharField())
    capabilities = serializers.ListField(child=serializers.CharField())
    modelEyebrow = serializers.CharField(required=False)
    modelTitle = serializers.CharField(required=False)
    capabilitiesEyebrow = serializers.CharField(required=False)
    capabilitiesTitle = serializers.CharField(required=False)
    workflowEyebrow = serializers.CharField(required=False)
    workflowTitle = serializers.CharField(required=False)
    tasksEyebrow = serializers.CharField(required=False)
    tasksTitle = serializers.CharField(required=False)


class LeaderSerializer(serializers.Serializer):
    name = serializers.CharField()
    position = serializers.CharField()
    born = serializers.CharField()
    education = serializers.CharField()
    imageIndex = serializers.IntegerField(allow_null=True)


class CatalogItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    fileUrl = serializers.CharField(source="get_download_url")
    embedUrl = serializers.CharField(source="get_embed_url")
    description = serializers.CharField(allow_blank=True, required=False)
    fileSize = serializers.CharField(source="file_size", allow_blank=True, required=False)


class NarxNavoProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    text = serializers.CharField(allow_blank=True, required=False)
    fileUrl = serializers.SerializerMethodField()
    imageUrl = serializers.SerializerMethodField()

    def get_fileUrl(self, obj):
        return obj.file.url if obj.file else None

    def get_imageUrl(self, obj):
        return obj.image.url if obj.image else None


class ElonlarProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    text = serializers.CharField(allow_blank=True, required=False)
    fileUrl = serializers.SerializerMethodField()
    imageUrl = serializers.SerializerMethodField()
    order = serializers.IntegerField(default=0)
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(required=False)

    def get_fileUrl(self, obj):
        return obj.file.url if obj.file else None

    def get_imageUrl(self, obj):
        return obj.image.url if obj.image else None


class PageSerializer(serializers.Serializer):
    slug = serializers.CharField()
    title = serializers.CharField()
    type = serializers.CharField()
    status = serializers.CharField(required=False)
    document = serializers.CharField(required=False)
    intro = serializers.CharField(required=False)
    items = serializers.ListField(child=serializers.CharField(), required=False)
    email = serializers.EmailField(required=False)
    leaders = LeaderSerializer(many=True, required=False)
    catalogItems = CatalogItemSerializer(many=True, required=False, source="catalog_items")
    elonlarList = ElonlarProductSerializer(many=True, required=False)
    content = serializers.CharField(required=False, allow_blank=True)
    fileUrl = serializers.CharField(required=False, allow_null=True)
    imageUrl = serializers.CharField(required=False, allow_null=True)



class SitePayloadSerializer(serializers.Serializer):
    brand = BrandSerializer()
    assets = AssetsSerializer()
    contact = ContactSerializer()
    navigation = NavigationItemSerializer(many=True)
    home = HomeSerializer()
    pages = PageSerializer(many=True)


class PagesResponseSerializer(serializers.Serializer):
    pages = PageSerializer(many=True)


class ErrorSerializer(serializers.Serializer):
    detail = serializers.CharField()

