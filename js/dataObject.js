localforage.config({
    name: 'expenses'
});

var DataObject = {
    Init: function (name) {
        this.Name = name;
        this.objectName = name.toLowerCase();
    },
    GetData: function (dataType) {
        debugger;
        var dataObject = this;
        localforage.getItem(this.objectName + '_' + dataType)
                .then(function (val, err) {
                    if (val != null) {
                        return this;
                    } else {
                        debugger;
                        var url = '/' + dataObject.objectName + '/list';
                        $(document).trigger(dataObject.objectName + ":beforeload");
                        $.ajax(url)
                                .done(function (response) {
                                    localforage.setItem(dataObject.objectName + '_' + dataType, response)
                                            .then(function () {
                                                $(document).trigger(dataObject.objectName + ":loadcomplete");
                                                return this;
                                            });
                                })
                                .fail(function (response) {
                                    console.log(response);
                                    $(document).trigger(dataObject.objectName + ":loadfailed");
                                    return this;
                                });
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
    }
};