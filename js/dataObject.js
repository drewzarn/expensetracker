var CACHETIMEOUT = 15 * 60;
localforage.config({
    name: 'expenses'
});

var DataObject = {
    Init: function (name) {
        this.Name = name;
        this.objectName = name.toLowerCase();
        this.URL = '/' + this.objectName + '/list';

        var dataObject = this;
        $(document).trigger(dataObject.objectName + ':dataloading');
        localforage.getItem(dataObject.objectName + '_data')
                .then(function (cacheValue) {
                    if (cacheValue != null
                            && (Math.round((new Date()).getTime() / 1000) - cacheValue.timestamp) < CACHETIMEOUT
                            && Object.keys(cacheValue.list).length > 0
                            ) {
                        $(document).trigger(dataObject.objectName + ':dataloaded', cacheValue);
                    } else {
                        $.ajax(dataObject.URL)
                                .done(function (ajaxResponse) {
                                    localforage.setItem(dataObject.objectName + '_data', ajaxResponse);
                                    $(document).trigger(dataObject.objectName + ':dataloaded', ajaxResponse);
                                });
                    }
                });
    },
    Refresh: function () {
        var dataObject = this;
        $(document).trigger(dataObject.objectName + ':dataloading');
        $.ajax(dataObject.URL)
                .done(function (ajaxResponse) {
                    localforage.setItem(dataObject.objectName + '_data', ajaxResponse);
                    $(document).trigger(dataObject.objectName + ':dataloaded', ajaxResponse);
                });
    },
    Nuke: function () {
        localforage.clear();
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