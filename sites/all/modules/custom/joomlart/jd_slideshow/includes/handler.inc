<?php
/*
$JA#COPYRIGHT$
*/
$path = drupal_get_path('module', 'jd_slideshow');
$template_path = $path . '/templates';
function jd_slideshow_form_add (&$form_state, $edit = array())
{
    $edit += array('name' => '', 'description' => '', 
    'type' => '', 'required' => 0, 'weight' => 0);
    $form['name'] = array('#type' => 'textfield', 
    '#title' => t('Name'), '#default_value' => $edit['name'], 
    '#maxlength' => 255, 
    '#description' => t(
    'The name for this slideshow, e.g., <em>"lastest news"</em>.'), 
    '#required' => TRUE);
    //get list of template
    $templates = jd_slideshow_get_templates();
    foreach ($templates as $key => $value) {
        $templates[$key] = $key;
    }
    $form['type'] = array('#type' => 'select', 
    '#title' => t('Template'), '#default_value' => $edit['type'], 
    '#options' => $templates, 
    '#description' => t(
    'The template for slideshow, each template of slideshow will have each configuration'), 
    '#required' => TRUE);
    $form['screen'] = array('#type' => 'value', 
    '#value' => '<img src="test.jpg" />');
    $form['submit'] = array('#type' => 'submit', 
    '#value' => t('Next'));
    if (isset($edit['vid'])) {
        $form['delete'] = array(
        '#type' => 'submit', 
        '#value' => t('Delete'));
        $form['vid'] = array('#type' => 'value', 
        '#value' => $edit['vid']);
        $form['module'] = array(
        '#type' => 'value', 
        '#value' => $edit['module']);
    }
    return $form;
}
function jd_slideshow_form_add_submit ($form, &$form_state)
{
    // Fix up the nodes array to remove unchecked nodes.
    $values = $form_state['values'];
    $query = "INSERT INTO {jd_slideshow} (`name`, `type`, `description`) VALUES ('%s','%s','%s')";
    db_query($query, $values['name'], $values['type'], '');
    drupal_set_message(t('Slideshow was added'));
    $id = db_last_insert_id('{jd_slideshow}', 'id');
    $form_state['redirect'] = 'admin/settings/slideshow/config/' .
     $id;
    return;
}
/**
 * Configuaration parameter for each slideshow
 *
 * @param load from config file(.ini) $params
 * @param id for block using this slideshow $block_id
 * @return drupal system form: config slideshow
 */
function jd_slideshow_config ($params, $block_id = null)
{
    $slide = JDSDataHelper::getSlide($block_id);
    $templates = jd_slideshow_get_templates();
    //process for theme list of templates
    $template = $slide['type'];
    $configs = $templates[$template]['config'];
    if (! is_array($configs))
        return false;
    $form = array();
    $form['#attributes'] = array('id' => 'jd-slideshow-form');
    $form['type'] = array('#type' => 'fieldset', 
    '#title' => t('Slideshow Infomation'), 
    '#collapsible' => TRUE, '#collapsed' => FALSE);
    $html_info = '
				<table width="100%">
					<tr>
						<td colspan="2">
							<input class="form-submit" onclick="javascript:window.location=\'' . url(
    'admin/settings/slideshow') . '\'" type="button" value="' . t(
    'Slideshow list') . '" />
							<input class="form-submit" onclick="javascript:window.location=\'' . url(
    'admin/settings/slideshow') . '\'" type="button" value="' . t(
    'Cancel') . '" />
							<input class="form-submit" onclick="javascript:window.location=\'' . url(
    'admin/settings/slideshow/delete/' . $block_id) . '\'" type="button" value="' .
     t('Remove') . '" />
						</td>
					</tr>
					<tr>
						<td width="40%" valign="top">
							<table width="100%">
								<tr>
									<td width="1%">' . t('Name:') . '</td>
									<td>' . $slide['name'] . '</td>
								</tr>
								<tr>
									<td>' . t('Type:') . '</td>
									<td>' . $slide['type'] . '</td>
								</tr>
								<tr>
									<td>' . t('ID:') . '</td>
									<td>' . $slide['id'] . '</td>
								</tr>
							</table>
						</td>
						
					</tr>
				</table>
				';
    $form['type']['display'] = array('#value' => $html_info);
    //Build data source option
    $source_ops = array();
    if (strtolower($configs['getfromcontent']) == 'yes' || $configs['getfromcontent'] ==
     1) {
        $configs['getfromcontent'] = true;
    } else {
        $configs['getfromcontent'] = false;
    }
    if (strtolower($configs['getfromfolder']) == 'yes' || $configs['getfromfolder'] ==
     1) {
        $configs['getfromfolder'] = true;
    } else {
        $configs['getfromfolder'] = false;
    }
    $source_ops['getfromcontent'] = $configs['getfromcontent'];
    $source_ops['getfromfolder'] = $configs['getfromfolder'];
    JD_Slideshow::general_options($form, $block_id);
    //JD_Slideshow::data_options($form,$block_id,$source_ops);
    $form['option'] = array(
    '#type' => 'fieldset', '#title' => t('Advanced options'), 
    '#collapsible' => TRUE, '#collapsed' => TRUE);
    foreach ($configs as $config_name => $config_attrs) {
        $config_name = strtolower($config_name);
        if (is_array($config_attrs) && ! in_array(
        $config_name, array('js', 'css'))) {
            JD_Slideshow::gen_attrs(
            $form, $block_id, 
            $config_attrs, 
            $config_name);
        }
    }
    $form['block_id'] = array('#type' => 'hidden', 
    '#value' => $block_id);
    $form['buttons']['submit'] = array('#type' => 'submit', 
    '#value' => t('Save configuration'));
    $form['#submit'][] = 'jd_slideshow_config_submit';
    //return system_settings_form ( $form );
    return $form;
}
function jd_slideshow_config_submit ($form, &$form_state)
{
    $config = $form_state['values'];
    $id = $config['block_id'];
    $config = serialize($config);
    $sql = "UPDATE {jd_slideshow} SET config = '%s' WHERE id = $id";
    db_query($sql, $config);
    $form_state['redirect'] = 'admin/settings/slideshow/';
}
/**
 * show list slideshow, will appear in block list of configuration
 *
 * @param task before show:remove, add new, cancel $task
 * @param block id of this slideshow $block_id
 * @return theme: jd-slideshow-list.tpl
 */
function jd_slideshow_list ($task = null)
{
    $slides = JDSDataHelper::getSlides();
    $form = array('#tree' => TRUE);
    foreach ($slides as $slide) {
        $form[$slide['id']]['#slides'] = (array) $slide;
        $form[$slide['id']]['name'] = array(
        '#value' => check_plain($slide['name']));
        $form[$slide['id']]['types'] = array(
        '#value' => check_plain($slide['type']));
        $form[$slide['id']]['config'] = array(
        '#value' => l(t('configure'), 
        "admin/settings/slideshow/config/" . $slide['id']));
        $form[$slide['id']]['delete'] = array(
        '#value' => '<a href=\'' . url(
        'admin/settings/slideshow/delete/' . $slide['id']) .
         '\' onclick="javascript: var cfm = confirm(\'' .
         t(
        'Are you sure to delete this slideshow?') .
         '\'); if(cfm) return true; return false">' .
         t('delete') . '</a>');
    }
    return $form;
}
/**
 * get category, field list :using for ajax
 *
 * @param nodetype $type
 * @param blockid $block_id
 */
function jd_slideshow_nodetype ($type = NULL, $block_id = NULL)
{
    //get from taxonomy
    $result = array();
    if (function_exists(taxonomy_form_all)) {
        $taxs = array();
        $taxs[0] = t('--Choose category--');
        $taxs = array_merge($taxs, 
        jd_slideshow_categories($type));
        $html = '';
        foreach ($taxs as $key => $tax) {
            if (! is_array($tax)) {
                $html .= '<option value="' .
                 $key .
                 '">' .
                 $tax .
                 '</option>';
            } else {
                $html .= '<optgroup label="' .
                 $key .
                 '">';
                foreach ($tax as $key => $item) {
                    $html .= '<option value="' .
                     $key .
                     '">' .
                     $item .
                     '</option>';
                }
                $html .= '</optgroup>';
            }
        }
    }
    $result['cat'] = $html;
    /* 
  		Set field to get image base on node type
  		defautl is 'body' field
  	*/
    $html = '';
    if (function_exists('content_types')) {
        $imgfields = array();
        $type = content_types($type);
        $fields = $type['fields'];
        if (count($fields)) {
            foreach ($fields as $field_id => $field_data) {
                if (($field_data['type'] ==
                 'filefield') &&
                 ($field_data['widget']['type'] ==
                 'imagefield_widget')) {
                    $imgfields[$field_id] = $field_data['widget']['label'];
                }
            }
        }
        $imgfields['body'] = t('Body');
        foreach ($imgfields as $key => $fieldname) {
            $selected = $key == 'body' ? 'selected' : '';
            $html .= '<option value="' .
             $key . '" ' . $selected .
             '>' . $fieldname . '</option>';
        }
    }
    $result['imgfield'] = $html;
    drupal_json($result);
}
/**
 * get category list
 *
 * @param nodetype $type
 * @return category list
 */
function jd_slideshow_categories ($type = NULL)
{
    $vocabularies = taxonomy_get_vocabularies($type);
    $options = array();
    foreach ($vocabularies as $vid => $vocabulary) {
        if ($vocabulary->tags && ! $free_tags) {
            continue;
        }
        $tree = taxonomy_get_tree($vid);
        if ($tree && (count($tree) > 0)) {
            $options[$vocabulary->name] = array();
            foreach ($tree as $term) {
                $options[$vocabulary->name][$term->tid] = str_repeat(
                '-', 
                $term->depth) .
                 $term->name;
            }
        }
    }
    return $options;
}
/**
 * Get template list from template folder
 * todo: need check template from current themes and from module
 *
 * @return list of template file and ini config struct
 */
function jd_slideshow_get_templates ()
{
    global $jd_slideshow_templates;
    if (! $jd_slideshow_templates) {
        $path = drupal_get_path('module', 
        'jd_slideshow');
        $template_path = $path . DIRECTORY_SEPARATOR .
         'templates';
        //get list of ini file in templates folder
        $list = file_scan_directory(
        $template_path, '.ini');
        $jd_slideshow_templates = array();
        if (is_array($list)) {
            foreach ($list as $item) {
                $jd_slideshow_template = array();
                $jd_slideshow_template['config'] = drupal_parse_info_file(
                $item->filename);
                $jd_slideshow_template['file'] = $item;
                $jd_slideshow_templates[$item->name] = $jd_slideshow_template;
            }
        }
        $GLOBALS['jd_slideshow_templates'] = $jd_slideshow_templates;
    }
    return $jd_slideshow_templates;
}
function jd_slideshow_delete ($id)
{
    $sql = "DELETE FROM {jd_slideshow} WHERE id = $id";
    db_query($sql);
    _block_rehash();
    drupal_set_message(t('A slideshow was deleted!'));
    drupal_redirect_form('', 'admin/settings/slideshow');
}
?>