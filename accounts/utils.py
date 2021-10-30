import json
import xmltodict

def xml_to_dict(xml):
    return xmltodict.parse(xml)