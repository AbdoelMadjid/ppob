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
*/?>
<form name="frmAddSlideshow" id="frmAddSlideshow" action="<?php echo url('admin/settings/slideshow/new') ?>" method="POST">
<table width="100%" class="">
	<tr>
		<td width="50%" valign="top">
		<table width="100%">
			<tr>
				<td>
					<label for="jd_slideshow_themes">
						<?php echo t('Choose type') ?>
					</label>
				</td>
				<td>
					<select id="jd_slideshow_theme" name="jd_slideshow_theme">
						<?php
						$f_theme = null;
						$js = 'var jds_desc = new Array();';
						$js .= 'var jds_screen = new Array();';
						
						foreach ($themes as $key=>$theme){
							if(!$f_theme){
								$f_theme = $theme;
							}
							
							$js.= 'jds_desc["' . $key . '"] = "' . $theme['description'] . '";';
							$js.= 'jds_screen["' . $key . '"] = "' . $theme['img_path'] . '";';
							echo '<option value="'.$key.'">'.$theme['name'].'</option>';
						}
						
						drupal_add_js($js, 'inline');
						?>
					</select>
					<div class="description" id="jds_desc"><?php echo $f_theme['description'] ?></div>
				</td>
			</tr>
			
			<tr>
				<td><label><?php echo t('Slideshow Name:') ?></label></td>
				<td>
					<input type="text" name="jd_slideshow_name" value="" />
				</td>
			</tr>
			<tr>
				<td><label><?php echo t('Slideshow ID:') ?></label></td>
				<td><input type="text" name="jd_slideshow_id" value="" /></td>
			</tr>
			<tr>
				<td colspan="2">
					<input class="form-submit" onclick="return jds_submit();" type="button" value="<?php echo t('Add') ?>" />
				</td>
			</tr>
		</table>
		</td>
		<td>
		<div>
			<img src="<?php echo $f_theme['img_path'] ?>" alt="<?php echo $f_theme['description'] ?>" />
			<input  id="jd_slidewshow_screen" name="jd_slidewshow_screen" value="<?php echo $f_theme['img_path'] ?>" type="hidden" />
		</div>	
		</td>
	</tr>
</table>
</form>
<script>
	$(document).ready(function(){
		$('#jd_slideshow_theme').change(function (){
			var jds_selected = $('#jd_slideshow_theme').val();
			
			$('#jds_desc').text(jds_desc[jds_selected]);
			$('#jd_slidewshow_screen').attr('value',jds_screen[jds_selected]);
			$('#jds_image').attr('src', jds_screen[jds_selected]);
		}
		);
	});
	
	function jds_submit(){
		var name = $('input[name=jd_slideshow_name]').val();
		var id = $('input[name=jd_slideshow_id]').val();
		if($.trim(name) == ''){
			alert('Please enter name for slideshow');
			return;
		}
		
		if($.trim(id) == ''){
			alert('Please enter ID for slideshow');
			return;
		}
		
		$('form[name=frmAddSlideshow]').submit();
	}
</script>