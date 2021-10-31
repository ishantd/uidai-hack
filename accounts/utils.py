import json
import xmltodict
import googlemaps
from datetime import datetime

from django.conf import settings


def compare_two_geocodes(original, new):
    gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
    original_geocode_result = gmaps.geocode(original)
    new_geocode_result = gmaps.geocode(new)
    return original_geocode_result, new_geocode_result

def xml_to_dict(xml):
    return xmltodict.parse(xml)