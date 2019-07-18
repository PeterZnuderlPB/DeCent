import json
from rest_framework import generics, permissions
from django.contrib.auth.models import Group
from django.core.cache import cache
import collections

from .serializers import GroupSerializer
from .permissions import HasGroupPermission
from rest_framework.response import Response

from django.shortcuts import render

class GroupList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    required_scopes = ['groups']
    permission_groups={
        'GET': ['__all__'],
    }
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get(*args, **kwargs):
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)

    

def home(request):
	return render(request, 'home.html')

# Dictionary parser - Aljaz
class DictionaryFilterParser():
    __fullDictionaryList = []
    __filteredDictionaryList = []
    __dictionary = {}
    __filteredDictionary = collections.OrderedDict()
    __keyString = ""

    def __init__(self, oldDictionaryList):
        self.__clearData()
        self.__parse(oldDictionaryList)

    def __del__(self):
        self.__fullDictionaryList = []
        self.__filteredDictionaryList = []
        self.__dictionary = {}
        self.__filteredDictionary = collections.OrderedDict()
        self.__keyString = ""

    def __getDictionaryDepth(self, dictionary):
        if isinstance(dictionary, dict):
            return 1 + (max(map(self.__getDictionaryDepth, dictionary.values())) if dictionary else 0)
        return 0

    def __walkThruDictionary(self, dictionary):
        for key, value in dictionary.items():
            if isinstance(value, dict):
                self.__keyString += f"{key}__"
                self.__walkThruDictionary(value)

                if self.__getDictionaryDepth(value) == 1:
                    self.__keyString = ""
            else:
                if not self.__keyString == "":
                    self.__dictionary[f'{self.__keyString}{key}'] = value
                else:
                    self.__dictionary[f'{key}'] = value
        
    def __parse(self, dictionaryList):
        for dictionary in dictionaryList:
            self.__walkThruDictionary(dictionary)
            self.__fullDictionaryList.append(self.__dictionary)
            self.__dictionary = {}

    def __parseFiltered(self, visibleFields):
        for dictionary in self.__fullDictionaryList:
            self.__filteredDictionary = collections.OrderedDict()
            for visibleField in visibleFields:
                for key, value in dictionary.items():
                    if visibleField == key:
                        self.__filteredDictionary[key] = value
            self.__filteredDictionaryList.append(self.__filteredDictionary)

    def __clearData(self):
        self.__fullDictionaryList = []
        self.__filteredDictionaryList = []
        self.__dictionary = {}
        self.__filteredDictionary = collections.OrderedDict()
        self.__keyString = ""

    def GetFullParsedDictionary(self):
        return self.__fullDictionaryList

    def GetFilteredParsedDictionary(self, visibleFields):
        self.__parseFiltered(visibleFields)
        return self.__filteredDictionaryList

# Usage example of DictionaryFilterParse class
def MergeDictionary(oldDictionary):
    dparser = DictionaryFilterParser(oldDictionary)
    print(f"NEWDICT: {dparser.GetParsedDictionary()}")

class PBListViewMixin(object): 
    #permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = None
    table_name = "BASE LIST VIEW" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['PostViewer'],
        'PUT':['PostViewer'],
        'DELETE':[],
    }
    required_permissions={
        'GET':['post.view_post'],
        'POST':['post.add_post'],
        'PUT':['post.change_post'],
        'DELETE':['post.delete_post']
    }
    DEFAULT_QUERY_SETTINGS={
        'results':10,
        'page':1,
        'sortOrder':[],
        'sortField':[],
        'visibleFields':['id', 'title'],
        'filters':{}
    }

    def get_queryset(self, q_settings):
        if (type(q_settings) == type('')):
            q_settings = json.loads(q_settings)
        dictkeys = q_settings.keys()
        order= list(q_settings.get('sortOrder'))
        orderfield = list(q_settings.get('sortField'))
        for i in range(len(order)):
            if(order[i]=="descend"):
                orderfield[i] = "-" + orderfield[i]
            elif(order[i] == None):
                orderfield[i]= None

        nullOrder = [i for i in range(len(order)) if order[i]== None]
        clean_orderfield = [orderfield[i] for i in range(len(orderfield)) if orderfield[i] is not None]

        filters = q_settings.get('filters', None)
        filters_with_type = {}
        for key, val in filters.items():
            filters_with_type[key + "__icontains"] = filters[key]
        qs = self.model.objects.filter(**filters_with_type).order_by(*clean_orderfield)
        return qs   

    def list(self, request, *args, **kwargs):
        #cache.set(request.user.id, request.query_params, timeout=CACHE_TTL)
        #--------------------------------------------------------------
        # Getting or setting redis cache and deciding on values to use
        #--------------------------------------------------------------
        key = "USER_" + str(request.user.id) + ":BROWSE:" + self.table_name
        #cache.delete(key)
        default_val = self.DEFAULT_QUERY_SETTINGS
        received_val = None
        rec_val_str = request.query_params.get('settings', None)
        if(rec_val_str != 'null' and  rec_val_str is not None):
            received_val = json.loads(rec_val_str)
            #received_val = received_val[0]
        cached_val = None

        if key in cache:
            cached_val = cache.get(key)
            if(type(cached_val) == type("")):
                cached_val = json.loads(cached_val)
        else: 
            cache.set(key, default_val, timeout=None)
            cached_val=default_val
        
        try:
            if received_val != None:
                cache.set(key, json.dumps(received_val), timeout=None)
                cached_val=received_val
        except:
            print("Error setting data to cache.")

        final_val = None
        if received_val is not None:
            final_val=received_val
        elif cached_val is not None:
            final_val=cached_val

        #-----------------------------
        # Using final value for query
        #-----------------------------
        queryset_full = self.get_queryset(final_val)
        #fullset = self.model.objects.all()
        size = queryset_full.count()

        page = int(final_val.get('page'))
        results = int(final_val.get('results'))
        tfrom = (page-1)*results
        tto = page*results
        if(size < tfrom ):
            tfrom = 0
            tto = results
        queryset = queryset_full[tfrom:tto]

        serializerclass = self.get_serializer_class()

        if(type(final_val) != type({})):
            final_val = json.loads(final_val)
        visibleFields = final_val.get('visibleFields', None)

        serializer = serializerclass(queryset, many=True)
        dparser = DictionaryFilterParser(serializer.data)
        keyNames = [key for key in dparser.GetFullParsedDictionary()[0].keys()]

        response = {    
            'table_name': 'Posts Browse',
            'available_columns': keyNames,
            'data': dparser.GetFilteredParsedDictionary(visibleFields),
            'size': size,
            'settings': final_val
        }
        return Response(response)