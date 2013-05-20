<?php
/*
$JA#COPYRIGHT$
*/
class JD_Slideshow {
	function getData($block_info) {
		global $base_url, $base_root;
		$configFile = JD_Slideshow::getConfigFile ( $block_info ['type'] );
		$configs = JD_Slideshow::getConfig ( $configFile, $block_info ['id'] );
		// print_r($configs);
		$select = 'n.nid, n.title, teaser, body FROM {node} n INNER JOIN {node_revisions} r ON n.nid=r.nid';
		if ($configs ['data'] ['category']) {
			$select .= ' INNER JOIN term_node ta ON n.nid = ta.nid ';
		}
		$where = ' WHERE n.status=1 ';
		$conditions = array ();
		$conditions [] = 'n.type=\'' . $configs ['data'] ['nodetype'] . '\'';
		if ($configs ['data'] ['category']) {
			$conditions [] = 'ta.tid=' . $configs ['data'] ['category'];
		}
		$where .= ' AND ' . implode ( ' AND ', $conditions );
		//get node data
		$order_by = ' ORDER BY r.vid DESC';
		$order_by .= $configs ['data'] ['order_field'] == 'title' ? ' ,title ' : '  ,n.changed ';
		$order_by .= $configs ['data'] ['sort_order'];
		$num_item = $configs ['data'] ['num_item'];
		if ($configs ['data'] ['type'] == 'node') {
			$datalist = JDSDataHelper::getData ( $configs );
		} else {
			$datalist = array ();
			$jdData = new JDSDataHelper ();
			$options = array ();
			$options ['folder'] = $configs ['data'] ['img_folder'];
			$options ['description'] = $configs ['data'] ['img_description'];
			$options ['sortby'] = 1;
			$options ['sortorder'] = $configs ['data'] ['img_sort_order'];
			$options ['mainwidth'] = $configs ['general'] ['mainwidth'];
			$options ['mainheight'] = $configs ['general'] ['mainheight'];
			$options ['mainwidth'] = $configs ['general'] ['mainwidth'];
			$options ['thumbwidth'] = $configs ['general'] ['thumbwidth'];
			$options ['thumbheight'] = $configs ['general'] ['thumbheight'];
			$options ['thumbfolder'] = $configs ['general'] ['thumbfolder'];
			$options ['thumb'] = $configs ['general'] ['thumb'];			
			$datalist = $jdData->getListImages ( $options );
		}
		$return = array ();
		$return ['data'] = $datalist;
		$return ['config'] = $configs ['general'];
		//get template file
		$return ['file'] = str_replace ( $configFile->basename, $configFile->name . '.tpl.php', $configFile->filename );
		return $return;
	}
	function getConfigFile($template) {
		global $theme;
		$path = drupal_get_path ( 'module', 'jd_slideshow' );
		$template_path = $path . DS . 'templates';
		$files = file_scan_directory ( $template_path, $template . '.ini' );
		foreach ( $files as $path => $file ) {
			return $file;
		}
		return $file;
	}
	function getConfig($file, $block_id) {
		$query = "SELECT config FROM {jd_slideshow} where id = $block_id";
		$result = db_fetch_array ( db_query ( $query ) );
		$result = unserialize ( $result ['config'] );
		$configs = array ();
		$configs ['data'] = array ();
		$configParams = drupal_parse_info_file ( $file->filename );
		$configs ['getfromcontent'] = strtolower ( $configParams ['getfromcontent'] ) == 'yes' ? true : false;
		$configs ['getfromfolder'] = strtolower ( $configParams ['getfromfolder'] ) == 'yes' ? true : false;
		//first get data configuration
		if ($configs ['getfromcontent']) {
			$configs ['data'] ['nodetype'] = $result ['nodetype'];
			$configs ['data'] ['category'] = $result ['category'];
			$configs ['data'] ['imgfield'] = $result ['imgfield'];
			$configs ['data'] ['sort_field'] = $result ['sort_field'];
			$configs ['data'] ['sort_order'] = $result ['sort_order'];
			$configs ['data'] ['num_item'] = $result ['num_item'];
		}
		if ($configs ['getfromfolder']) {
			$configs ['data'] ['img_folder'] = $result ['imgfolder'];
			$configs ['data'] ['img_description'] = $result ['imgdescription'];
			$configs ['data'] ['img_sort_field'] = $result ['imgsort_field'];
			$configs ['data'] ['img_sort_order'] = $result ['imgsort_order'];
		}
		if ($configs ['getfromcontent'] && $configs ['getfromfolder']) {
			$configs ['data'] ['type'] = $result ['source'];
		} elseif ($configs ['getfromcontent']) {
			$configs ['data'] ['type'] = 'node';
		} else {
			$configs ['data'] ['type'] = 'folder';
		}
		//Get content from source
		$configs ['general'] = array ();
		//parse global data (mainwidth, mainheight, thumbwidht...)
		$configs ['general'] ['mainwidth'] = $result ['width'];
		$configs ['general'] ['mainheight'] = $result ['height'];
		$configs ['general'] ['thumbwidth'] = $result ['thumbwidth'];
		$configs ['general'] ['thumbheight'] = $result ['thumbheight'];
		$configs ['general'] ['thumbfolder'] = $result ['thumb_folder'];
		$configs ['general'] ['thumb'] = $result ['thumb'];
		//parse and add js and css
		$template_url = str_replace ( $file->basename, '', $file->filename );
		$template_url = str_replace ( '\\', "/", $template_url );
		if ($configParams ['js']) {
			if (is_array ( $configParams ['js'] )) {
				foreach ( $configParams ['js'] as $js ) {
					drupal_add_js ( $template_url . $js );
				}
			} else {
				drupal_add_js ( $template_url . $configParams ['js'] );
			}
		}
		if ($configParams ['css']) {
			if (is_array ( $configParams ['css'] )) {
				foreach ( $configParams ['css'] as $css ) {
					drupal_add_css ( $template_url . $css, 'theme' );
				}
			} else {
				drupal_add_css ( $template_url . $configParams ['css'] );
			}
		}
		$config_names = array_keys ( $configParams );
		for($i = 0; $i < count ( $config_names ); $i ++) {
			if (is_array ( $configParams [$config_names [$i]] ) && ! in_array ( $config_names [$i], array ('js', 'css' ) )) {
				JD_Slideshow::parse_attrs ( $block_id, $configParams [$config_names [$i]], $config_names [$i] );
			}
		}
		foreach ( $configParams as $config_name => $config_attrs ) {
			if (! in_array ( $config_name, array ('name', 'screen', 'description', 'getfromcontent', 'getfromfolder', 'js', 'css' ) )) {
				$configs ['general'] [$config_name] = $config_attrs;
			}
		}
		return $configs;
	}
	function parse_attrs($block_id, &$configs, $prefix) {
		$query = "SELECT config FROM {jd_slideshow} where id = $block_id";
		$result = db_fetch_array ( db_query ( $query ) );
		$result = unserialize ( $result ['config'] );
		//print_r($result);
		if ($configs ['value'] || $configs ['type']) {
			foreach ( $configs as $key => $value ) {
				if ($key == 'default' || $key == 'default_value') {
					$default = $value;
				}
			}
			$configs = ($result [$prefix] == null) ? $default : $result [$prefix];
		} else {
			if (is_array ( $configs )) {
				$config_names = array_keys ( $configs );
				for($i = 0; $i < count ( $config_names ); $i ++) {
					JD_Slideshow::parse_attrs ( $block_id, $configs [$config_names [$i]], $prefix . '_' . $config_names [$i] );
				}
			}
		}
	}
	function gen_attrs(&$form, $block_id, $configs, $prefix) {
		//print_r($configs);
		$query = "SELECT config FROM {jd_slideshow} where id = $block_id";
		$result = db_fetch_array ( db_query ( $query ) );
		$result = unserialize ( $result ['config'] );
		if ($configs ['value'] || $configs ['type']) {
			$default = null;
			foreach ( $configs as $key => $value ) {
				if ($key == 'default' || $key == 'default_value') {
					$default = $value;
				} else {
					$attrs ['#' . $key] = $value;
				}
				$attrs ['#default_value'] = ($result [$prefix] == null) ? $default : $result [$prefix];
				;
			}
			$form ['option'] [$prefix] = $attrs;
		} else {
			if (is_array ( $configs )) {
				foreach ( $configs as $config_name => $config_attrs ) {
					JD_Slideshow::gen_attrs ( $form, $block_id, $config_attrs, $prefix . '_' . $config_name );
				}
			}
		}
	}
	function data_options(&$form, $block_id, $options) {
		$query = "SELECT config FROM {jd_slideshow} where id = $block_id";
		$result = db_fetch_array ( db_query ( $query ) );
		$result = unserialize ( $result ['config'] );
		//Process source options
		if ($options ['getfromcontent'] && $options ['getfromfolder']) {
			$source_options = array ();
			$source_options ['node'] = t ( 'From Node' );
			$source_options ['folder'] = t ( 'From Folder' );
			$form ['source'] = array ('#type' => 'radios', '#options' => $source_options, '#title' => t ( 'Source' ), '#default_value' => $result ['source'], '#prefix' => '<div id="source" rel="chooseone:source:node,folder:node_settings,image_settings">', '#suffix' => '</div><div class="clr"></div>', '#attributes' => array ('class' => 'jd_slideshow_source' ), '#description' => t ( "Choose content source to display ." ) );
		}
		if ($options ['getfromcontent']) {
			$form ['node_settings'] = array ('#type' => 'fieldset', '#prefix' => '<div id="node_settings">', '#suffix' => '</div>', '#title' => t ( 'Node settings' ), '#collapsible' => TRUE, '#collapsed' => FALSE );
			//todo: get node type inlude view, book...
			$nodetypes = array ();
			//First get node type
			$q = 'SELECT type, name, description FROM {node_type}';
			$results = db_query ( $q );
			while ( $node = db_fetch_array ( $results ) ) {
				$nodetypes [$node ['type']] = $node ['name'];
			}
			$jd_slideshow_nodetype = $result ['nodetype'];
			$form ['node_settings'] ['nodetype'] = array ('#type' => 'select', '#options' => $nodetypes, '#title' => t ( 'Node Type' ), '#default_value' => $jd_slideshow_nodetype, '#attributes' => array ('onchange' => 'changeNodeType(\'' . url ( 'admin/settings/slideshow/node/' ) . '\')' ), '#description' => t ( "Get node type from drupal system (Also check and get from view)." ), '#suffix' => '<div id="jds_nodepros">' );
			//get from taxonomy
			if (function_exists ( taxonomy_form_all )) {
				$taxs = array ();
				$taxs [0] = t ( '--Choose category--' );
				$taxs = array_merge ( $taxs, jd_slideshow_categories ( $jd_slideshow_nodetype ) );
				if (is_array ( $taxs ) && count ( $taxs )) {
					//$nodetypes[t('--Categories--')] = $taxs;
					$form ['node_settings'] ['category'] = array ('#type' => 'select', '#options' => $taxs, '#title' => t ( 'Category' ), '#default_value' => $result ['category'], '#description' => t ( "Get category of node." ) );
				}
			}
			/* 
		  		Set field to get image base on node type
		  		defautl is 'body' field
		  	*/
			if (function_exists ( 'content_types' )) {
				$imgfields = array ();
				$type = content_types ( $jd_slideshow_nodetype );
				$fields = $type ['fields'];
				if (count ( $fields )) {
					foreach ( $fields as $field_id => $field_data ) {
						if (($field_data ['type'] == 'filefield') && ($field_data ['widget'] ['type'] == 'imagefield_widget')) {
							$imgfields [$field_id] = $field_data ['widget'] ['label'];
						}
					}
				}
				if (count ( $imgfields )) {
					$imgfields ['body'] = t ( 'Body' );
					$form ['node_settings'] ['img_field'] = array ('#type' => 'select', '#options' => $imgfields, '#title' => t ( 'Image Field' ), '#default_value' => $result ['img_field'], '#description' => t ( "Field have image to display(also get from cck if user installed)." ) );
				}
			}
			//todo: get node type
			$sortfields = array ();
			$sortfields [] = 'Title';
			$sortfields [] = 'Date';
			$form ['node_settings'] ['sort_field'] = array ('#type' => 'select', '#options' => $sortfields, '#title' => t ( 'Sort By' ), '#default_value' => 0, '#prefix' => '</div>', '#description' => t ( "Field have image to display(also get from cck if user installed)." ) );
			//todo: get node type
			$sortdirections = array ();
			$sortdirections ['ASC'] = 'ASC';
			$sortdirections ['DESC'] = 'DESC';
			$form ['node_settings'] ['sort_order'] = array ('#type' => 'select', '#options' => $sortdirections, '#title' => t ( 'Ascending OR Descending' ), '#default_value' => 0, '#description' => t ( "Field have image to display(also get from cck if user installed)." ) );
			$form ['node_settings'] ['num_item'] = array ('#type' => 'textfield', '#title' => t ( 'Number Item' ), '#default_value' => $result ['num_item'], '#description' => t ( "Number item display in module" ) );
		}
		if ($options ['getfromfolder']) {
			/*start image folder setting*/
			$form ['image_settings'] = array ('#type' => 'fieldset', '#prefix' => '<div id="image_settings">', '#suffix' => '</div>', '#title' => t ( 'image settings' ), '#collapsible' => TRUE, '#collapsed' => FALSE );
			$form ['image_settings'] ['imgfolder'] = array ('#type' => 'textfield', '#title' => t ( 'Image Folder' ), '#default_value' => $result ['imgfolder'], '#description' => t ( "Add the path to the folder from which Slideshow will call the images. Eg. <i>sites/all/images/slideshow</i>" ) );
			$imgsortorders = array ();
			$imgsortorders [1] = 'ASC';
			$imgsortorders [2] = 'DESC';
			$form ['image_settings'] ['imgsort_order'] = array ('#type' => 'select', '#options' => $imgsortorders, '#title' => t ( 'Sort Order' ), '#default_value' => $result ['imgsort_order'], '#description' => t ( "Sort Order" ) );
		}
	}
	function general_options(&$form, $block_id) {
		$query = "SELECT config FROM {jd_slideshow} where id = $block_id";
		$result = db_fetch_array ( db_query ( $query ) );
		$result = unserialize ( $result ['config'] );
		
		$form ['general'] = array ('#type' => 'fieldset', '#title' => t ( 'Image options' ), '#collapsible' => TRUE, '#collapsed' => FALSE );
		/*start image folder setting*/
		$form ['general'] ['imgfolder'] = array ('#type' => 'textfield', '#title' => t ( 'Image Folder' ), '#default_value' => $result ['imgfolder'], '#description' => t ( "Add the path to the folder from which Slideshow will call images. Eg. <i>sites/all/images/slideshow</i>" ) );
		$form ['general'] ['imgdescription'] = array ('#type' => 'textarea', '#title' => t ( 'Description for each image' ), '#default_value' => $result ['imgdescription'], '#description' => t ( "Add text descripton to each image. Format: [desc img=\"your_image_name\"] your description goes here [/desc]" ) );
		$imgsortorders = array ();
		$imgsortorders [1] = 'ASC';
		$imgsortorders [2] = 'DESC';
		$form ['general'] ['imgsort_order'] = array ('#type' => 'select', '#options' => $imgsortorders, '#title' => t ( 'Sort Order' ), '#default_value' => $result ['imgsort_order'], '#description' => t ( "The order of images in slideshow" ) );
		$form ['general'] ['width'] = array ('#type' => 'textfield', '#title' => t ( 'Main Item Width' ), '#default_value' => $result ['width'] , '#description' => t ( "The width of image in slideshow" ));
		$form ['general'] ['height'] = array ('#type' => 'textfield', '#title' => t ( 'Main Item Height' ), '#default_value' => $result ['height'], '#description' => t ( "The height of image in slideshow" ) );
		$form ['general'] ['thumb'] = array ('#type' => 'select', '#title' => t ( 'Auto Resize Thumbnail' ), '#options' => array (1 => t ( 'Yes' ), 0 => t ( 'No' ) ), '#default_value' => $result ['thumb'], '#description' => t ( "If Yes is enabled, all images will be resized automatically. If No, you MUST create manually a sub folder in source folder of your content items, name it \"resized\" to store your thumbnails. Eg. site/all/images/resized" ) );
		$form ['general'] ['thumbwidth'] = array ('#type' => 'textfield', '#title' => t ( 'Thumbnail Width' ), '#default_value' => $result ['thumbwidth'], '#description' => t ( "The width of thumbnail in pixel") );
		$form ['general'] ['thumbheight'] = array ('#type' => 'textfield', '#title' => t ( 'Thumbnail Height' ), '#default_value' => $result ['thumbheight'], '#description' => t ( "The height of thumbnail in pixel") );
	}
}
?>