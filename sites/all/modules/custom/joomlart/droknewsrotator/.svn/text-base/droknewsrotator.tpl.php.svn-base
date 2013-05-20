<?php
/**
 * @file droknewsrotator.tpl.php
 * Default theme implementation for roknewsrotator.
 *
 * Available variables:
 * - $links: Array of primary links available to for the menu.
 *
 * @see template_preprocess_droknewsrotator()
 * @see theme_droknewsrotator()
 */
?>

<?php 
	$limitnum = variable_get("droknewsrotator_rotatorCount", 6);
	$delay = variable_get("droknewsrotator_delay", 7000);
	$duration = variable_get("droknewsrotator_duration", 800);
	$autoplay = variable_get("droknewsrotator_autoplay", 'true');
	$autohide_controls = variable_get("droknewsrotator_autohide_controls", 'true');
	$controls = variable_get("droknewsrotator_rotator_controls", 'true');
	$preview_length = variable_get("droknewsrotator_preview_length", 300);
	$img_path = variable_get("droknewsrotator_img_path", 'files/stories/rotator/');
	
	global $theme_key;
?>
			
<?php			
	$sql = "SELECT node_revisions.title, node_revisions.body, node_revisions.nid, node_revisions.timestamp, node.promote, node.nid FROM node_revisions INNER JOIN node ON node_revisions.nid = node.nid WHERE node.promote = 1 ORDER BY node_revisions.timestamp DESC LIMIT $limitnum";
	$result = db_query($sql);
?>
			
			
<script type="text/javascript" src="sites/all/modules/droknewsrotator/roknewsrotator-packed.js"></script>
<script type="text/javascript">
	window.addEvent('domready', function() {
	var rotator = new RokNewsRotator('news-rotator', {
		delay: <?php echo $delay; ?>,
		duration: <?php echo $duration; ?>,
		corners: false,
		blankimage: '<?php echo drupal_get_path("theme", $theme_key); ?>/images/blank.png',
		autoplay: <?php echo $autoplay; ?>,
		autohide: <?php echo $autohide_controls; ?>,
		controls: <?php echo $controls; ?>		});
	});
</script>
			
			
<div id="news-rotator">
			
	<?php while ($anode = db_fetch_object($result)) : ?>
		  		
		<?php 
			$final_text = "";
		  	$final_text = $anode->body;
		  	
		  	$final_text = preg_replace("/<?php[^>]+\?>/i", "", $final_text);
		  	$final_text = str_replace("<?", "", $final_text);
		  	$final_text = strip_tags($final_text);
		  	$final_text = substr($final_text, 0, strpos($final_text, ' ', $preview_length)) . "..." ;
		?>
	  		
		<div class="story-block">
			<div class="divider">
				<div class="image">
	            	<a href="?q=node/<?php echo $anode->nid; ?>" title="<?php echo $anode->title; ?>"><img src="<?php echo drupal_get_path("theme", $theme_key); ?>/<?php echo $img_path . $anode->nid; ?>.jpg" alt="<?php echo $anode->title; ?>" /></a>
	            </div>
				<div class="story">
                	<div class="padding">
                    	 <h1><a href="?q=node/<?php echo $anode->nid; ?>"><?php echo $anode->title; ?></a></h1>
                     	<p>
							<?php echo $final_text; ?>
						</p>
                	</div>
            	</div>
            	
			
			<!--end story-block and divider divs-->
			</div>
		</div>';
			
	<?php endwhile; ?> <!--end while-->
			
	<!--end newsrotator div-->
</div>
