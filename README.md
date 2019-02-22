# GomapAzeWidget


#For using in yii view

<?php  $markersArray =  array(1=>array('lng'=>'5539338.6683015','lat'=>'4924111.9802944'),2=>array('lng'=>'5549715.2650425','lat'=>'4927499.460309'));
 
    $this->widget('common.extensions.GomapAze.GomapAzeWidget' , array(
        'lat'=>CHtml::activeId($model, 'lat'),
        'lng'=>CHtml::activeId($model, 'lng'),
        'defaultLng'=>'5544114.873558',
        'defaultLat'=>'4921705.6065225',
        'clickable'=>true,
        'multimarkers'=>false,
        'multicoordinates'=>$markersArray
	)
)?> 