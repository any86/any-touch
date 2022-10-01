## Support WeChat applet

Since there is no concept of dom element in the **applet**, we need to manually receive the event object of the **touch** event through the **catchEvent** method to identify

````xml
<view
   @touchstart="at.catchEvent"
   @touchmove="at.catchEvent"
   @touchend="at.catchEvent"
   @touchcancel="at.catchEvent">
</view>
````

````javascript
const at = new AnyTouch()
{
     onload(){
         at.on('press', onPress);
     }
}
````

[:rocket: back to directory](../README.md#directory)
