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
 $path = drupal_get_path('module', 'jd_slideshow');
?>
<script type="text/javascript" src="<?php echo $path?>/jquery-ui-1.8.custom.min.js"></script>
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
		navigation: <?php echo $settings["animation"]["navigation"]?>,
		thumbnav: <?php echo $settings["animation"]["thumbnav"]?>
		});
});

</script>


<div class="jd-slideshow-wrap jd-oganis" id="jd-slideshow-<?php echo $block_id?>">
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
	<?php if($settings["animation"]["thumbnav"]!=0){
		$width = $settings['thumbwidth']?$settings['thumbwidth']:60;
		$height = $settings['thumbheight']?$settings['thumbheight']:60;
	?>
	<div class="jd-slideshow-thumb">
		<ul class="thumb-list clearfix" style="">
			<?php $count= count($datalist); foreach($datalist as $k=>$item){
				$thumb=preg_replace("/ /","%20",$item->resized);
				
			?>
			<li class="thumb-item <?php if($k==0)echo 'first';elseif ($k==$count-1)echo 'last';?>">
				<a style="cursor: pointer;" title="Item Title"><span style="display: block; width: <?php echo $width?>px; height: <?php echo $height?>px;  background-image: url(<?php echo $thumb?>);"></span></a>
			</li>
			
			<?php }?>
		</ul>
		<div class="thumb-mask clearfix">
			<span class="thumb-mask-item thumb-mask-first" >&nbsp;</span>
			<span class="thumb-mask-item thumb-mask-current">&nbsp;</span>
			<span class="thumb-mask-item thumb-mask-last">&nbsp;</span>
		</div>
		<div class="ja-slide-thumbs-handles clearfix" >
			<?php $count= count($datalist); foreach($datalist as $k=>$item){				
			?>
			<span style="width: <?php echo $width+10; ?>px; height: <?php echo $height+10;?>px;" class="<?php if($k==0)echo 'first';elseif ($k==$count-1)echo 'last';?>">&nbsp;</span>
			<?php }?>     						
    </div>
	</div>
	<?php }?>
</div>

