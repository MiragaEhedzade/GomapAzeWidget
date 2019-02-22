<?php

/**
 * GomapAzeWidget
 *
 * @author   Ahadzade Miraga <miraga.ehedzade@gmail.com>
 **/
class GomapAzeWidget extends CWidget
{
    public $lat;
    public $lng;
    public $defaultLat;
    public $defaultLng;
    public $clickable;
    public $multimarkers;
    public $multicoordinates;

    public function init()
    {
        parent::init();

    }

    public function run()
    {
        $jsArray = array();
        if ($this->multimarkers) {

            foreach ($this->multicoordinates as $array) {
                $jsArray[] = array('lng' => $array['lng'], 'lat' => $array['lat']);
            }
        }

        $baseDir = dirname(__file__);
        $assets = Yii::app()->getAssetManager()->publish($baseDir . DIRECTORY_SEPARATOR .
            'assets');
        $cs = Yii::app()->getClientScript();

        $cs->registerCssFile($assets . '/css/font-awesome.min.css');
        $cs->registerCssFile($assets . '/css/mapstyle.css');
        $cs->registerCssFile($assets . '/css/style.css');

        echo '<div id="map"></div>
              <div class="boxMap">
    		   <div class="search-container">
                 <div id="searchForm" type="search">
                    <input type="search" id="search"/>
    		        <button class="icon search"><i class="fa fa-search"></i></button>
                 </div>
                </div>
               </div>';


        Yii::app()->clientScript->registerScript('setVar', 'var latInput = "' . $this->
            lat . '"
         var lngInput = "' . $this->lng . '" 
         var defaultLat = "' . $this->defaultLat . '"
         var defaultLng = "' . $this->defaultLng . '"
         var clickable  = "' . $this->clickable . '"
         var multimarkers = "' . $this->multimarkers . '"
         var multicoordinates = ' . json_encode($jsArray) . '
         
         ', CClientScript::POS_END);

        $cs->registerScriptFile('http://maps.google.com/maps/api/js?v=3.3&sensor=false');
        $cs->registerScriptFile($assets . '/js/OpenLayers.js', CClientScript::POS_END);
        $cs->registerScriptFile($assets . '/js/main.js', CClientScript::POS_END);
        $cs->registerScriptFile($assets . '/js/superagent.js', CClientScript::POS_END);


    }

}
?>