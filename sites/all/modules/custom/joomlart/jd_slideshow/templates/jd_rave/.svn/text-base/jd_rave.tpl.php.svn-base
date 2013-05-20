<?php
/*
# ------------------------------------------------------------------------
# JD slideshow module
# ------------------------------------------------------------------------
# Copyright (C) 2004-2010 JoomlArt.com. All Rights Reserved.
# @license - PHP files are GNU/GPL V2. CSS / JS are Copyrighted Commercial,
# bound by Proprietary License of JoomlArt. For details on licensing, 
# Please Read Terms of Use at http://www.joomlart.com/terms_of_use.html.
# Author: JoomlArt.com
# Websites:  http://www.joomlart.com -  http://www.joomlancers.com
# Redistribution, Modification or Re-licensing of this file in part of full, 
# is bound by the License applied. 
# ------------------------------------------------------------------------
*/ 
?>
<style>
<!--

.jd-slideshow {
	margin: 0 auto;
}
-->
</style>
<?php $path = drupal_get_path('module', 'jd_slideshow');
?>
<script type="text/javascript" src="<?php echo $path?>/jd_slideshow.js"></script>

<script type="text/javascript">
jQuery(document).ready(function(){
	jQuery("#jd-slideshow-<?php echo $block_id;?>").JDSlideshow({
		total: <?php echo $total =  count($datalist)?>,
		maineffect: "<?php echo $settings["animation"]["maineffect"]?>",
		duration: <?php echo $settings["animation"]["duration"]?>,
		interval: <?php echo $settings["animation"]["interval"]?>,
		showdesc: <?php echo $settings["animation"]["showdesc"]?>,	
		mouseover: <?php echo $settings["animation"]["mouseover"]?>,
		navlength: <?php echo $settings["animation"]["navlength"]?>,
		navigation: <?php echo $settings["animation"]["navigation"]?>
		});
});

</script>


<div class="jd-slideshow-wrap jd-purity" id="jd-slideshow-<?php echo $block_id?>">
	<div class="jd-slideshow" style="width: <?php echo $settings["mainwidth"]?>px; height: <?php echo $settings["mainheight"]?>px;">
		<?php foreach($datalist as $k=>$item){
			$image=preg_replace("/ /","%20",$item->image);
		?>
		<div class="ss-item" style="background-image: url(<?php echo $image?>);  display: none; width: <?php echo $settings["mainwidth"]?>px; height: <?php echo $settings["mainheight"]?>px;">
		<?php if($settings["animation"]["showdesc"]!=0){			 
			//$body=preg_replace("/<img+[^>]+>/","",$item->body);		
			$body=$item->body;		
	    	$temp="";
	    	for($i=0;$i<200;$i++){
	    		$temp.=$body{$i};
	    	}
	    	$body=$temp;
	    	if(trim($body)!=''){
	    	?>
		
			<div class="ss-desc-wrap ss-desc-<?php echo $k;?>" style="display: none;">
				<div class="ss-desc" ><?php echo $item->body?></div>
			</div>
			<?php } }?>
		</div>
		<?php }?>
	</div>
	<?php if($settings["animation"]["navigation"]!=0){?>
	<div class="jd-slideshow-nav" style="display: none;">
		<ul class="nav-list">
			<li class="nav-prev fisrt">
				<a style="cursor: pointer;" title="Previous"><span>Pre</span></a>
			</li>
			<li class="nav-before" style="display: none;"><span>...</span></li>
			<?php foreach($datalist as $k=>$item){?>
			<li class="nav-item" style="display: none;">
				<a style="cursor: pointer;" title="<?php echo $k+1?>"><span><?php echo $k+1?></span></a>
			</li>
			<?php }?>
			<li class="nav-after" style="display: none;"><span>...</span></li>
			<li class="nav-next last">
				<a style="cursor: pointer;" title="Next"><span>Next</span></a>
			</li>
		</ul>
		<?php if($settings["animation"]["control"]){?>
		<ul class="nav-control">
			<li class="nav-play">
				<a style="cursor: pointer;" title="Play/Stop"><span class="nav-control-play">Stop</span></a>
			</li>			
		</ul>
		<?php }?>
	</div>
	<?php }?>
</div>

