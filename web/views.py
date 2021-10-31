from django.shortcuts import render

def address_request(request):
    context = {}
    return render(request, 'web/request.html', context)
