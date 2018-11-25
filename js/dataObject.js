localforage.config({
    name: 'expenses'
});

var DataObject = {
    Init: function (name) {
        this.Name = name;
        this.objectName = name.toLowerCase();
        this.URL = '/' + this.objectName + '/list';

        var dataObject = this;
        localforage.getItem(dataObject.objectName + '_data')
                .then(function (cacheValue) {
                    if (cacheValue != null)
                        $(document).trigger(dataObject.objectName + ':dataloaded', cacheValue);
                    return;
                    $.ajax(dataObject.URL)
                            .done(function (ajaxResponse) {
                                localforage.setItem(dataObject.objectName + '_data', ajaxResponse);
                                $(document).trigger(dataObject.objectName + ':dataloaded', ajaxResponse);
                            });
                });
    },
    Refresh: function () {
        var dataObject = this;
        $.ajax(dataObject.URL)
                .done(function (ajaxResponse) {
                    localforage.setItem(dataObject.objectName + '_data', ajaxResponse);
                    $(document).trigger(dataObject.objectName + ':dataloaded', ajaxResponse);
                });
    },
    GetData: function () {
        var dataObject = this;
        localforage.getItem(this.objectName + '_data')
                .then(function (val) {
                    if (val == null) {
                        dataObject.Refresh();
                    }
                });
        return localforage.getItem(this.objectName + '_data');
    }
};