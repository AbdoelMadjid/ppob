<?php
/**
 * @file drokmininews.tpl.php
 * Default theme implementation for drokmininews.
 *
 * Available variables:
 * - none.
 *
 * @see template_preprocess_rokmininews()
 * @see theme_rokmininews()
 */
?>

<?php
	$article_count = variable_get("drokmininews_article_count", 15);
	$preview_length = variable_get("drokmininews_preview_length", 75);
	$sections = variable_get("drokmininews_sections", 6);

	$i = 1;
	
	global $theme_key;

?>

	
<div id="rokmininews">
	
	
	<?php while ($i <= $sections) : ?>
	
		<?php 	
			$cat = "drokmininews_cat_" . $i;
			$catID = "drokmininews_cat_id_" . $i;
			$imgDir = "drokmininews_img_dir_" . $i;
			$catColor = "drokmininews_color_" . $i;
			$vocab = "drokmininews_vocab_" . $i;
			$default_show = "drokmininews_default_show_" . $i;
			
			$rokCategory = variable_get($cat,'');
			$rokCategoryID = variable_get($catID,'');
			$rokImageDir = variable_get($imgDir, '');
			$rokCategory_color = variable_get($catColor,'');
			$rokVocab = variable_get($vocab,'');
			$rokShow = variable_get($default_show,0);
		?>
		
		<?php if($rokCategory != "") : ?>
		
			<?php		
				$sql = "SELECT 
							node_revisions.title, node_revisions.nid, node_revisions.body, node_revisions.timestamp 
						FROM 
							node_revisions 
						INNER JOIN 
							term_node ON node_revisions.nid = term_node.nid 
						WHERE 
							term_node.tid = $rokCategoryID 
						ORDER BY
							node_revisions.timestamp DESC LIMIT $article_count";
				$result = db_query($sql);
			?>
		
		
			<div class="moduletable">
					<script type="text/javascript">
						RokMN.settings['section-<?php echo $rokVocab; ?>'] = <?php echo $rokShow; ?>;
					</script>
				<div class="block-1 mininews <?php echo $rokCategory_color; ?>" id="section-<?php echo $rokVocab; ?>">
					<div class="corner-tl">
						<div class="corner-tr">
							<div class="corner-bl">
								<div class="corner-br">
								
									<div class="mininews-headline">
										<div class="mover"><span>Move</span></div>
										<div class="counter"><span>Display <a href="#" class="mininews-stories-0">0</a> | <a href="#" class="mininews-stories-5">5</a> | <a href="#" class="mininews-stories-10">10</a> | <a href="#" class="mininews-stories-15">15</a> Stories</span></div>
										<h2><?php echo $rokCategory; ?></h2>
									</div>
									<div class="mininews-inner">
										<div class="mininews-wrapper">
											<div class="mininews-titles">
												<div class="topic-names">Topics</div>
												<div class="top-story">Top Story</div>
												<div class="other-stories">Other Stories</div>
											</div>
			
											<?php									
												$term_sql = "SELECT * FROM term_data WHERE vid = $rokVocab ORDER BY name";
												$termsResult = db_query($term_sql);
												$items = array();
											?>									
			
											<div class="sub-categories">
											
												<?php while ($category = db_fetch_object($termsResult)) : ?>
													<?php if($category->name != $rokCategory) : ?>
														<div>
															<a href="?q=taxonomy/term/<?php echo $category->tid; ?>"><?php echo $category->name; ?></a>
														</div>
														
													<?php endif; ?>
													
												<?php endwhile; ?>
													
											</div>
											
											<?php $loop_count = 1; ?>
											
											<?php while ($anode = db_fetch_object($result)) : ?>
												
												<?php
											  		$final_text = "";
											  		$final_text = $anode->body;
									  	
												  	$final_text = preg_replace("/<?php[^>]+\?>/i", "", $final_text);
												  	$final_text = str_replace("<?", "", $final_text);
												  	$final_text = strip_tags($final_text);
											  		$final_text = substr($final_text, 0, strpos($final_text, ' ', $preview_length)) . "..." ;
												?>								
																		
												<?php if($loop_count == 1) : ?>
																							
													<div class="lead-articles">
														<div class="entry article-">
															<h4><a href="?q=node/' . $anode->nid . '"><?php echo $anode->title; ?></a></h4>
															<img src="<?php echo drupal_get_path("theme", $theme_key); ?>/files/stories/<?php echo $rokImageDir; ?>/<?php echo $anode->nid; ?>_thumb.jpg" class="mininews-thumb" />	
															<p><?php echo $final_text; ?></p>
														</div>
													</div>
														
																					
															
																	
												<?php elseif($loop_count == 2) : ?>
																					
													<div class="simple-articles">
												
														<div class="entry article-">
															<h4><a href="?q=node/<?php echo $anode->nid; ?>"><?php echo $anode->title; ?></a></h4>
															<img src="<?php echo drupal_get_path("theme", $theme_key); ?>/files/stories/<?php echo $rokImageDir; ?>/<?php echo $anode->nid; ?>_thumb.jpg" class="mininews-thumb" />	
															<p><?php echo $final_text; ?></p>
														</div>
														
												
																			
												<?php elseif($loop_count > 2) : ?>
												
													<div class="entry article-">
														<h4><a href="?q=node/<?php echo $anode->nid; ?>"><?php echo $anode->title; ?></a></h4>
													</div>
																						
												<?php endif; ?>	
																					
												<?php $loop_count++; ?>
																					
											<?php endwhile; ?>
												
										
														<div class="clr"></div>
													</div>	
												
												
											</div>
										</div>
										<div class="mininews-bottom"></div>
										
									</div>
								</div>
							</div>
						</div>
					</div>
					</div>
		
		
		
		
		<?php endif; ?> <!--end if has content-->	
			
	<?php $i++; ?>						
		
	<?php endwhile; ?> <!--end while-->
	
