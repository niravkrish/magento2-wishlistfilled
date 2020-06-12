require([
    'jquery',
    'underscore',
    'Magento_Customer/js/customer-data',
    'mage/translate',
    'domReady!'
], function ($, _, customerData) {
    'use strict';

    $ (function() {
        let wishlistedItemsIds      = [];
        let wishlist                = '';
        let wishlistItems           = '';
        let wishlistBtnSelector     = '[data-action="add-to-wishlist"]';
        let wishlistRemovePostData  = [];
        let wishlistRemoveSelector  = '.wishlist-remove-link[data-role="remove"]';

        wishlist = customerData.get('wishlist');
        wishlist.subscribe(function(newValue) {
            reloadWishlistedData();
        });

        _.defer(function() {reloadWishlistedData()}, 500);

        function reloadWishlistedData() {
            wishlistItems = wishlist().items;

            if (typeof wishlistItems != 'undefined' && wishlistItems.length > 0) {
                _.each(wishlistItems, function(item) {
                    wishlistedItemsIds.push(parseInt(item.product_id));
                    wishlistRemovePostData[parseInt(item.product_id)] = item.delete_item_params;
                });
                fillHeart();
            }
        }

        function fillHeart() {
            let wishlistbtns = $(document).find(wishlistBtnSelector);
            _.each(wishlistbtns, function(item) {
                let itemSelector = $(item);
                let productId = itemSelector.data('post').data.product;
                if (productId && productId > 0) {
                    if (_.contains(wishlistedItemsIds, productId)) {
                        itemSelector.addClass('wishlist-filled');
                        if(typeof wishlistRemovePostData != 'undefined' && wishlistRemovePostData[productId] != '') {
                            itemSelector.attr('data-role', 'remove')
                                .removeAttr('data-post')
                                .removeAttr('data-action')
                                .attr('data-post-remove', wishlistRemovePostData[productId])
                                .attr('title', $.mage.__('Remove Item'))
                                .addClass('btn-remove delete wishlist-remove-link')
                                .find('span').text($.mage.__('Remove item'));
                        }
                    } else {
                        itemSelector.removeClass('wishlist-filled');
                    }
                }
            });
        }

        function getQueryStringPrarams(url = '') {
            let result = {};
            if (url == '') {
                if (window.location.search !== "") {
                    const urlParams = new URLSearchParams(window.location.search);
                    let keys = urlParams.keys();
                    for (let key of keys) {
                        result[key] = urlParams.get(key);
                    }
                }
            } else {
                let parmas = '';
                url = url.split('?');
                parmas = url[url.length -1];
                if (parmas !== "") {
                    const urlParams = new URLSearchParams(parmas);
                    let keys = urlParams.keys();
                    for (let key of keys) {
                        result[key] = urlParams.get(key);
                    }
                }
            }
            return result;
        }

        /**
         * Reload Wishlist after applied amasty layered navigation filter
         */
        $( document ).ajaxComplete(function( event, xhr, settings ) {
            let params = {};
            params = getQueryStringPrarams(settings.url);
            if (_.keys(params).length > 0 && params.shopbyAjax == 1){
                reloadWishlistedData();
            }
        });

        /**
         * Remove From Wishlist When Heart is Filled
         */
        $(document).on('click', wishlistRemoveSelector, $.proxy(function (event) {
            event.preventDefault();
            $.mage.dataPost().postData($(event.currentTarget).data('post-remove'));
        }, this));
    });
});
