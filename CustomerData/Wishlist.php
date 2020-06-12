<?php
namespace NiravPatel\Wishlist\CustomerData;

use Magento\Wishlist\CustomerData\Wishlist as MagentoWishlist;

class Wishlist extends MagentoWishlist
{
    /**
     * Get wishlist items
     *
     * @return array
     */
    protected function getItems()
    {
        try {
            $this->view->loadLayout();
            $collection = $this->wishlistHelper->getWishlistItemCollection();
            $collection->clear()->setInStockFilter(true)->setOrder('added_at');
            $items = [];
            foreach ($collection as $wishlistItem) {
                $items[] = $this->getItemData($wishlistItem);
            }
            return $items;
        } catch (\Exception $e) {
            return [];
        }
    }
}
