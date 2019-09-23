define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var AutoCompleteFactory = /** @class */ (function () {
        function AutoCompleteFactory(url, form, serverInvoker, delayedInitializer) {
            this.url = url;
            this.form = form;
            this.serverInvoker = serverInvoker;
            this.delayedInitializer = delayedInitializer;
        }
        AutoCompleteFactory.prototype.enable = function (selector) {
            var _this = this;
            this.delayedInitializer.initialize(selector, function (i, e) { return new AutoComplete($(e), _this.url, _this.form, _this.serverInvoker).enable(); });
        };
        return AutoCompleteFactory;
    }());
    exports.AutoCompleteFactory = AutoCompleteFactory;
    var AutoComplete = /** @class */ (function () {
        function AutoComplete(input, url, form, serverInvoker) {
            this.input = input;
            this.url = url;
            this.form = form;
            this.serverInvoker = serverInvoker;
            this.awaitingAutocompleteResponses = 0;
        }
        AutoComplete.setOptions = function (options) {
            AutoComplete.customOptions = options;
        };
        AutoComplete.prototype.enable = function () {
            var _this = this;
            if (this.input.is("[data-typeahead-enabled=true]"))
                return;
            else
                this.input.attr("data-typeahead-enabled", "true");
            if (this.input.is("[data-change-action]"))
                this.serverInvoker.enableInvokeWithAjax(this.input, "typeahead:select", "data-change-action");
            this.input.wrap("<div class='typeahead__container'></div>");
            this.valueField = $("[name='" + this.input.attr("name").slice(0, -5) + "']");
            var url = this.input.attr("autocomplete-source") || '';
            url = this.url.effectiveUrlProvider(url, this.input);
            var postData = this.toObject(this.form.getPostData(this.input));
            postData[this.input.attr("name")] = "{{query}}";
            var clientSideSearch = this.input.attr("clientside") || false;
            var callback = {
                onClick: function (node, a, item, event) {
                    // The following line is a compile error.
                    // $("[name='" + node.attr("name").slice(0, -5) + "']").val(event.Value);
                },
                onClickAfter: function (node, a, item, event) {
                    _this.itemSelected(item);
                    _this.input.trigger("typeahead:select", { event: event, item: item });
                },
                onPopulateSource: function (node, data) {
                    var text = _this.input.val();
                    var index = data.findIndex(function (x) { return x.Text.trim().toLowerCase() === text.toLowerCase().trim(); });
                    if (index >= 0)
                        _this.valueField.val(data[index].Value);
                    return data;
                }
            };
            if (this.input.data("strict") === true) {
                callback = $.extend(callback, {
                    onHideLayout: function () {
                        if (_this.valueField.val() === "")
                            _this.input.val("");
                    }
                });
            }
            var defaultOptions = {
                minLength: 0,
                dynamic: !clientSideSearch,
                searchOnFocus: true,
                debug: false,
                delay: 500,
                backdrop: false,
                correlativeTemplate: true,
                emptyTemplate: "<div class='tt-suggestion'>Not found</div>"
            };
            var mandatoryOptions = {
                source: {
                    values: {
                        display: "Display",
                        data: [{
                                "Display": "",
                                "Text": "",
                                "Value": ""
                            }],
                        ajax: function (query) {
                            return {
                                type: "POST",
                                url: url,
                                data: postData,
                                xhrFields: { withCredentials: true }
                            };
                        }
                    }
                },
                callback: callback
            };
            this.input
                .wrap("<span class='typehead-chevron-down'></span>")
                .before('<i class="fas fa-chevron-down"></i>')
                .data("selected-text", "")
                .on('input', function () { return _this.clearValue(); })
                .typeahead($.extend(true, defaultOptions, AutoComplete.customOptions, mandatoryOptions));
        };
        AutoComplete.prototype.clearValue = function () {
            if (this.input.val() === "")
                this.valueField.val("");
            if (this.input.val() !== this.input.data("selected-text"))
                this.valueField.val("");
        };
        AutoComplete.prototype.itemSelected = function (item) {
            if (item) {
                var txt = (item.Text == null || item.Text == undefined || item.Text.trim() == "") ? item.Display : item.Text;
                if (txt)
                    txt = $("<div/>").html(txt).text();
                this.valueField.val(item.Value);
                this.input.data("selected-text", txt);
                this.input.val(txt);
            }
            else {
                console.log("Clearing text, item is undefined");
                this.input.data("selected-text", "");
            }
            // This will invoke RunOnLoad M# method as typeahead does not fire textbox change event when it sets its value from drop down
            this.input.trigger("change");
        };
        // Convert current form array to simple plain object
        AutoComplete.prototype.toObject = function (arr) {
            var rv = {};
            for (var i = 0; i < arr.length; ++i)
                rv[arr[i].name] = arr[i].value;
            return rv;
        };
        return AutoComplete;
    }());
    exports.default = AutoComplete;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b0NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BsdWdpbnMvYXV0b0NvbXBsZXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBS0E7UUFFSSw2QkFBb0IsR0FBUSxFQUNoQixJQUFVLEVBQ1YsYUFBNEIsRUFDNUIsa0JBQXNDO1lBSDlCLFFBQUcsR0FBSCxHQUFHLENBQUs7WUFDaEIsU0FBSSxHQUFKLElBQUksQ0FBTTtZQUNWLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1lBQzVCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFBSSxDQUFDO1FBRWhELG9DQUFNLEdBQWIsVUFBYyxRQUFnQjtZQUE5QixpQkFHQztZQUZHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUN2QyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSSxDQUFDLEdBQUcsRUFBRSxLQUFJLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBeEUsQ0FBd0UsQ0FBQyxDQUFBO1FBQzNGLENBQUM7UUFDTCwwQkFBQztJQUFELENBQUMsQUFYRCxJQVdDO0lBWFksa0RBQW1CO0lBYWhDO1FBVUksc0JBQW1CLEtBQWEsRUFDcEIsR0FBUSxFQUNSLElBQVUsRUFDVixhQUE0QjtZQUhyQixVQUFLLEdBQUwsS0FBSyxDQUFRO1lBQ3BCLFFBQUcsR0FBSCxHQUFHLENBQUs7WUFDUixTQUFJLEdBQUosSUFBSSxDQUFNO1lBQ1Ysa0JBQWEsR0FBYixhQUFhLENBQWU7WUFWaEMsa0NBQTZCLEdBQVcsQ0FBQyxDQUFDO1FBVU4sQ0FBQztRQVAvQix1QkFBVSxHQUF4QixVQUF5QixPQUF1QztZQUM1RCxZQUFZLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQztRQUN6QyxDQUFDO1FBT00sNkJBQU0sR0FBYjtZQUFBLGlCQXdGQztZQXRGRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLCtCQUErQixDQUFDO2dCQUFFLE9BQU87O2dCQUN0RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUV2RCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2dCQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUVsRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1lBRTVELElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFFN0UsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdkQsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVyRCxJQUFJLFFBQVEsR0FBUSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRXJFLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQztZQUVoRCxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUssQ0FBQztZQUU5RCxJQUFJLFFBQVEsR0FBb0M7Z0JBQzVDLE9BQU8sRUFBRSxVQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUs7b0JBQzFCLHlDQUF5QztvQkFDekMseUVBQXlFO2dCQUM3RSxDQUFDO2dCQUNELFlBQVksRUFBRSxVQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUs7b0JBQy9CLEtBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3hCLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsS0FBSyxPQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUUsQ0FBQyxDQUFBO2dCQUMzRCxDQUFDO2dCQUNELGdCQUFnQixFQUFFLFVBQUMsSUFBSSxFQUFFLElBQUk7b0JBQ3pCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQzVCLElBQUksS0FBSyxHQUFTLElBQUssQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBekQsQ0FBeUQsQ0FBQyxDQUFDO29CQUNsRyxJQUFJLEtBQUssSUFBSSxDQUFDO3dCQUNWLEtBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFM0MsT0FBTyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7YUFDSixDQUFDO1lBRUYsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ3BDLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtvQkFDMUIsWUFBWSxFQUFFO3dCQUNWLElBQUksS0FBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFOzRCQUM1QixLQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDM0IsQ0FBQztpQkFDSixDQUFDLENBQUM7YUFDTjtZQUVELElBQUksY0FBYyxHQUFtQztnQkFDakQsU0FBUyxFQUFFLENBQUM7Z0JBQ1osT0FBTyxFQUFFLENBQUMsZ0JBQWdCO2dCQUMxQixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsbUJBQW1CLEVBQUUsSUFBSTtnQkFDekIsYUFBYSxFQUFFLDRDQUE0QzthQUM5RCxDQUFDO1lBRUYsSUFBSSxnQkFBZ0IsR0FBbUM7Z0JBQ25ELE1BQU0sRUFBRTtvQkFDSixNQUFNLEVBQUU7d0JBQ0osT0FBTyxFQUFFLFNBQVM7d0JBQ2xCLElBQUksRUFBRSxDQUFDO2dDQUNILFNBQVMsRUFBRSxFQUFFO2dDQUNiLE1BQU0sRUFBRSxFQUFFO2dDQUNWLE9BQU8sRUFBRSxFQUFFOzZCQUNkLENBQUM7d0JBQ0YsSUFBSSxFQUFFLFVBQUMsS0FBSzs0QkFDUixPQUFPO2dDQUNILElBQUksRUFBRSxNQUFNO2dDQUNaLEdBQUcsRUFBRSxHQUFHO2dDQUNSLElBQUksRUFBRSxRQUFRO2dDQUNkLFNBQVMsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUU7NkJBQ3ZDLENBQUM7d0JBQ04sQ0FBQztxQkFDSjtpQkFDSjtnQkFDRCxRQUFRLEVBQUUsUUFBUTthQUNyQixDQUFDO1lBRUYsSUFBSSxDQUFDLEtBQUs7aUJBQ0wsSUFBSSxDQUFDLDZDQUE2QyxDQUFDO2lCQUNuRCxNQUFNLENBQUMscUNBQXFDLENBQUM7aUJBQzdDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDO2lCQUN6QixFQUFFLENBQUMsT0FBTyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsVUFBVSxFQUFFLEVBQWpCLENBQWlCLENBQUM7aUJBQ3BDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDakcsQ0FBQztRQUVTLGlDQUFVLEdBQXBCO1lBQ0ksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7Z0JBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztnQkFDckQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUVTLG1DQUFZLEdBQXRCLFVBQXVCLElBQVM7WUFFNUIsSUFBSSxJQUFJLEVBQUU7Z0JBQ04sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM3RyxJQUFJLEdBQUc7b0JBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN2QjtpQkFBTTtnQkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7Z0JBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUN4QztZQUNELDZIQUE2SDtZQUM3SCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBRUQsb0RBQW9EO1FBQzFDLCtCQUFRLEdBQWxCLFVBQW1CLEdBQWtDO1lBQ2pELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztnQkFDL0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ25DLE9BQU8sRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQUNMLG1CQUFDO0lBQUQsQ0FBQyxBQXRJRCxJQXNJQyJ9