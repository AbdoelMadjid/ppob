<?php
/*
$JA#COPYRIGHT$
*/
function theme_jd_slideshow_list($form){
	$rows = array();
  	foreach (element_children($form) as $key) {
    	if (isset($form[$key]['name'])) {
      		$slides = &$form[$key];

      		$row = array();
      		$row[] = drupal_render($slides['name']);
      		$row[] = drupal_render($slides['types']);
      		
      		$row[] = drupal_render($slides['edit']);
      		$row[] = drupal_render($slides['config']);
      		$row[] = drupal_render($slides['delete']);
      		$rows[] = array('data' => $row, 'class' => 'draggable');
    	}
  	}
  	if (empty($rows)) {
    	$rows[] = array(array('data' => t('No slide available.'), 'colspan' => '5'));
  	}

  	$header = array(t('Name'), t('Type'));
  	
  	
  	$header[] = array('data' => t('Operations'), 'colspan' => '3');
  	return theme('table', $header, $rows, array('id' => 'jd_slideshow')) . drupal_render($form);
}


?>