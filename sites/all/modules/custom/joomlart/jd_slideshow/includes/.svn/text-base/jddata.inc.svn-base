<?php
/*
$JA#COPYRIGHT$
*/

/**
 * modJASildeNews class.
 */
class JDSDataHelper {
	
	/**
	 * @var string $condition;
	 *
	 * @access private
	 */
	var $conditons = '';
	
	/**
	 * @var string $order 
	 *
	 * @access private
	 */
	var $order = 'a.ordering';
	
	/**
	 * @var string $limit
	 *
	 * @access private
	 */
	var $limit = '';
	
	function &getInstance() {
		static $instance = null;
		if (! $instance) {
			$instance = new ModJASlideshow3 ();
		}
		return $instance;
	}
	
	/**
	 * magic method 
	 * 
	 * @param string method  method is calling
	 * @param string $params.
	 * @return unknown 
	 */
	function callMethod($method, $params) {
		if (method_exists ( $this, $method )) {
			if (is_callable ( array ($this, $method ) )) {
				return call_user_func ( array ($this, $method ), $params );
			}
		}
		return false;
	}
	
	function getData($configs) {
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
		
		$datalist = array ();
		$JDImage = new JDImage ();
		if ($configs ['data'] ['imgfield'] == 'body' || ! $configs ['data'] ['imgfield']) {
			$sql = 'SELECT ' . $select . $where . ' GROUP BY n.nid ' . $order_by . ' LIMIT ' . $num_item;
			$result = db_query ( $sql );
			while ( $item = db_fetch_object ( $result ) ) {
				
				$image = $JDImage->parseImage ( $item->body );
				$item->image = $image;
				if ($configs ['general'] ['thumb'] == 'auto') {
					if ($image) {
						$resize = $JDImage->resize ( $image, $configs ['general'] ['thumbwidth'], $configs ['general'] ['thumbheight'] );
						$item->resized = $resize;
					}
				} else {
					$imgfile = explode ( '/', $image );
					$imgfile = $imgfile [count ( $imgfile ) - 1];
					
					$item->resized = $configs ['general'] ['thumbfolder'] . '/' . $imgfile;
					
					if (! file_exists ( $item->resized ))
						$item->resized = '';
				}
				$item->url = $base_root . url ( 'node/' . $item->nid );
				$datalist [] = $item;
			
			}
		} else {
			$cck_table = '{content_type_' . $configs ['data'] ['nodetype'] . '}';
			$select .= ' INNER JOIN ' . $cck_table . '  ON n.nid=' . $cck_table . '.nid INNER JOIN {files} f ON f.fid = ' . $cck_table . '.' . $configs ['data'] ['imgfield'] . '_fid';
			
			$sql = 'SELECT f.filepath as image,' . $select . $where . ' GROUP BY n.nid ' . $order_by . ' LIMIT ' . $num_item;
			
			$result = db_query ( $sql );
			
			while ( $item = db_fetch_object ( $result ) ) {
				$image = $item->image;
				if ($configs ['general'] ['thumb'] == 'auto') {
					if ($image) {
						$resize = $JDImage->resize ( $image, $configs ['general'] ['thumbwidth'], $configs ['general'] ['thumbheight'] );
						
						$item->resized = $resize;
					}
				} else {
					$imgfile = explode ( '/', $image );
					$imgfile = $imgfile [count ( $imgfile ) - 1];
					
					$item->resized = $configs ['general'] ['thumbfolder'] . '/' . $imgfile;
					if (! file_exists ( $item->resized ))
						$item->resized = '';
				}
				$datalist [] = $item;
			}
		}
		
		return $datalist;
	}
	
	function getSlides() {
		
		$result = db_query ( "SELECT * FROM {jd_slideshow} ORDER BY weight, name" );
		
		$slides = array ();
		
		while ( $slide = db_fetch_array ( $result ) ) {
			
			$slides [$slide ['id']] = $slide;
		}
		return $slides;
	}
	
	function getSlide($id) {
		$result = db_query ( "SELECT * FROM {jd_slideshow} WHERE id='$id'" );
		while ( $slide = db_fetch_array ( $result ) ) {
			return $slide;
		}
		return false;
	}
	/**
	 *
	 *
	 *
	 */
	function parserCustomTag($text) {
		if (preg_match ( "#{jaimage(.*)}#s", $text, $matches, PREG_OFFSET_CAPTURE )) {
			return $matches;
		}
		return null;
	}
	
	/**
	 * parser options, helper for clause where sql.
	 *
	 * @string array $options
	 * @return string.
	 */
	function getIds($options) {
		if (! is_array ( $options )) {
			return ( int ) $options;
		} else {
			return "'" . implode ( "','", $options ) . "'";
		}
	}
	
	/**
	 * add sort order sql
	 *
	 * @param string $order is article's field.
	 * @param string $mode is DESC or ASC
	 * @return .
	 */
	function setOrder($order, $mode) {
		$this->order = ' a.' . $order . ' ' . $mode;
		return $this;
	}
	
	/**
	 * add set limit sql
	 * 
	 * @param integer $limit.
	 * @return .
	 */
	function setLimit($limit) {
		$this->limit = $limit;
		return $this;
	}
	
	/**
	 * trim string with max specify
	 * 
	 * @param string $title
	 * @param integer $max.
	 */
	function trimString($title, $maxchars = 60) {
		if (function_exists ( 'mb_substr' )) {
			$doc = JDocument::getInstance ();
			return SmartTrim::mb_trim ( ($title), 0, $maxchars, $doc->_charset );
		} else {
			return SmartTrim::trim ( ($title), 0, $maxchars );
		}
	}
	
	/**
	 * get parameters from configuration string.
	 *
	 * @param string $string;
	 * @return array.
	 */
	function parseParams($string) {
		$string = html_entity_decode ( $string, ENT_QUOTES );
		$regex = "/\s*([^=\s]+)\s*=\s*('([^']*)'|\"([^\"]*)\"|([^\s]*))/";
		$params = null;
		if (preg_match_all ( $regex, $string, $matches )) {
			for($i = 0; $i < count ( $matches [1] ); $i ++) {
				$key = $matches [1] [$i];
				$value = $matches [3] [$i] ? $matches [3] [$i] : ($matches [4] [$i] ? $matches [4] [$i] : $matches [5] [$i]);
				$params [$key] = $value;
			}
		}
		return $params;
	}
	
	/**
	 * parser a image in the content of article.
	 */
	function parseImages(&$row, $params) {
		$row->link = $this->getLink ( $row );
		$text = $row->introtext . $row->fulltext;
		$row->date = strtotime ( $row->modified ) ? $row->created : $row->modified;
		$row->thumbnail = '';
		$row->mainImage = '';
		$data = $this->parserCustomTag ( $text );
		if (isset ( $data [1] [0] )) {
			$tmp = $this->parseParams ( $data [1] [0] );
			$row->mainImage = isset ( $tmp ['main'] ) ? $tmp ['main'] : '';
			$row->thumbnail = isset ( $tmp ['thumb'] ) ? $tmp ['thumb'] : '';
		} else {
			$regex = "/\<img.+src\s*=\s*\"([^\"]*)\"[^\>]*\>/";
			preg_match ( $regex, $text, $matches );
			$images = (count ( $matches )) ? $matches : array ();
			if (count ( $images )) {
				$row->mainImage = $images [1];
				$row->thumbnail = $images [1];
			}
		}
	}
	
	/**
	 * render image from image source.
	 */
	function renderImage($title, $image, $params, $width = 0, $height = 0, $attrs = '', $returnURL = false) {
		global $base_url;
		
		$cache_URL = '';
		if ($image) {
			$title = strip_tags ( $title );
			$thumbnailMode = 'crop';
			$aspect = 1;
			$crop = $thumbnailMode == 'crop' ? true : false;
			$jaimage = new JDImage ();
			if ($thumbnailMode != 'none' && $jaimage->sourceExited ( $image )) {
				$imageURL = $jaimage->resize ( $image, $width, $height, $crop, $aspect );
				
				if ($returnURL) {
					return $imageURL;
				}
				if ($imageURL == $image) {
					$width = $width ? "width=\"$width\"" : "";
					$height = $height ? "height=\"$height\"" : "";
					$image = "<img src=\"" . $cache_URL . "/$imageURL\"   alt=\"{$title}\" title=\"{$title}\" $width $height $attrs />";
				} else {
					$image = "<img src=\"" . $cache_URL . "/$imageURL\"  $attrs  alt=\"{$title}\" title=\"{$title}\" />";
				}
			} else {
				if ($returnURL) {
					return $image;
				}
				$width = $width ? "width=\"$width\"" : "";
				$height = $height ? "height=\"$height\"" : "";
				$image = "<img $attrs src=\"$image\" alt=\"{$title}\" title=\"{$title}\" $width $height />";
			}
		} else {
			$image = '';
		}
		// clean up globals
		return $image;
	}
	
	/**
	 *
	 *
	 */
	function getListImages($options) {
		
		$folder = $options ['folder'];
		$descriptions = $options ['description'];
		$thumbWidth = $options ['thumbwidth'] ? $options ['thumbwidth'] : 60;
		$thumbHeight = $options ['thumbheight'] ? $options ['thumbheight'] : 60;
		$mainWidth = $options ['mainwidth'];
		$mainHeight = $options ['mainheight'];
		
		$orderby = $options ['orderby'] == 1 ? 1 : 2;
		$sort = $options ['sortorder'] == 1 ? 1 : 2;
		
		$descriptionArr = preg_split ( '/<lang=([^>]*)>/', $descriptions, - 1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE );
		$description = '';
		
		if (count ( $descriptionArr ) > 1) {
			for($i = 0; $i < count ( $descriptionArr ); $i = $i + 2) {
				if ($descriptionArr [$i] == $iso_client_lang) {
					$description = $descriptionArr [($i + 1)];
					break;
				}
			}
			if (! $description) {
				$description = $descriptionArr [1];
			}
		} else if (isset ( $descriptionArr [0] )) {
			$description = $descriptionArr [0];
		}
		
		//Parse description. Description in format: [desc img="imagename" url="link"]Description goes here[/desc]
		

		$descriptionArray = $this->parseDescNew ( $description );
		
		$images = $this->readDirectory ( $folder, $orderby, $sort );
		
		$data = array ();
		foreach ( $images as $k => $img ) {
			$items [] = $k;
			if ($img) {
				$data ['captionsArray'] [] = (isset ( $descriptionArray [$img] ) && isset ( $descriptionArray [$img] ['caption'] )) ? str_replace ( "'", "\'", $descriptionArray [$img] ['caption'] ) : '';
			}
			// URL of image proccess
			$url = isset ( $descriptionArray [$img] ['url'] ) ? $descriptionArray [$img] ['url'] : '';
			$id = (isset ( $descriptionArray [$img] ) && isset ( $descriptionArray [$img] ['id'] )) ? $descriptionArray [$img] ['id'] : '';
			if ($id)
				$url = 'url';
			$data ['urls'] [] = $url;
			// Target of URL
			$target = isset ( $descriptionArray [$img] ['target'] ) ? $descriptionArray [$img] ['target'] : '';
			$id = (isset ( $descriptionArray [$img] ) && isset ( $descriptionArray [$img] ['id'] )) ? $descriptionArray [$img] ['id'] : '';
			if ($id)
				$target = 'target';
			$data ['targets'] [] = $target;
			
			if ($options ['thumb']) {
				$JDImage = new JD_Image ();
				$JDImage->__cachePath = $folder . '/resized/';
				$data ['thumbArray'] [] = $JDImage->resize ( $folder . '/' . $img, $thumbWidth, $thumbHeight );
				//$data ['thumbArray'] [] = $this->renderImage ( '', $folder . '/' . $img, $params, $thumbWidth, $thumbHeight, '', true );
			

			} /*else {
				
				$imgfile = explode ( '/', $img );
				$imgfile = $imgfile [count ( $imgfile ) - 1];
				
				//echo $options['thumbfolder'];
				$data ['thumbArray'] [] = $options ['thumbfolder'] . '/' . $imgfile;
			}*/
			
			//$data ['mainImageArray'] [] = $this->renderImage ( '', $folder . '/' . $img, $params, $mainWidth, $mainHeight, '', true );
			$data ['mainImageArray'] [] = $folder . '/' . $img;
		}
		if (! $options ['thumb']) {
			$data ['thumbArray'] = $this->readDirectory ( $folder . '/resized/', $orderby, $sort );
		}
		$datalist = array ();
		for($i = 0; $i < count ( $data ['captionsArray'] ); $i ++) {
			$item = new stdClass ();
			$item->title = $data ['captionsArray'] [$i];
			$item->body = $data ['captionsArray'] [$i];
			$item->image = $data ['mainImageArray'] [$i];
			$item->resized = $folder . '/resized/' . $data ['thumbArray'] [$i];
			$item->url = $data ['urls'] [$i];
			$item->target = $data ['targets'] [$i];
			
			$datalist [] = $item;
		}
		
		return $datalist;
	
	}
	
	/**
	 *
	 *
	 */
	function readDirectory($folder, $orderby, $sort) {
		$imagePath = $folder;
		
		$imgFiles = file_scan_directory ( $imagePath, 'bmp|gif|jpg|png|jpeg', array ('.', '..', 'CVS' ), 0, $recurse = false );
		
		$folderPath = $folder . '/';
		$imageFile = array ();
		$i = 0;
		foreach ( $imgFiles as $file ) {
			$i_f = $file->filename;
			$imageFile [$i] [0] = $file->basename;
			$imageFile [$i] [1] = filemtime ( $i_f );
			$i ++;
		
		}
		
		$images = $this->sortImage ( $imageFile, $orderby, $sort );
		
		return $images;
	}
	/**
	 *
	 *
	 */
	function getFile($name, $modPath, $tmplPath = '') {
		if (! $tmplPath) {
			global $mainframe;
			$tmplPath = 'templates' . DS . $mainframe->getTemplate () . DS . 'css' . DS;
		}
		if (file_exists ( JPATH_SITE . DS . $tmplPath . $name )) {
			return $tmplPath . $name;
		}
		return $modPath . $name;
	}
	
	/**
	 *
	 *
	 */
	function sortImage($image, $orderby, $sort) {
		$sortObj = array ();
		$imageName = array ();
		if ($orderby == 1) {
			for($i = 0; $i < count ( $image ); $i ++) {
				$sortObj [$i] = $image [$i] [1];
				$imageName [$i] = $image [$i] [0];
			}
		} else {
			for($i = 0; $i < count ( $image ); $i ++) {
				$sortObj [$i] = $image [$i] [0];
			}
			$imageName = $sortObj;
		}
		if ($sort == 1)
			array_multisort ( $sortObj, SORT_ASC, $imageName );
		elseif ($sort == 2)
			array_multisort ( $sortObj, SORT_DESC, $imageName );
		else
			shuffle ( $imageName );
		return $imageName;
	}
	
	/**
	 *
	 *
	 */
	function parseDescNew($description) {
		
		$regex = '#\[desc ([^\]]*)\]([^\[]*)\[/desc\]#m';
		preg_match_all ( $regex, $description, $matches, PREG_SET_ORDER );
		
		$descriptionArray = array ();
		foreach ( $matches as $match ) {
			$params = $this->parseParams ( $match [1] );
			if (is_array ( $params )) {
				$img = isset ( $params ['img'] ) ? trim ( $params ['img'] ) : '';
				if (! $img)
					continue;
				$url = isset ( $params ['url'] ) ? trim ( $params ['url'] ) : '';
				$target = isset ( $params ['target'] ) ? trim ( $params ['target'] ) : '';
				$descriptionArray [$img] = array ('url' => $url, 'caption' => str_replace ( "\n", "\n", trim ( $match [2] ) ), 'target' => $target );
			}
		}
		return $descriptionArray;
	}

}
?>
<?php

if (! class_exists ( 'SmartTrim' )) {
	class SmartTrim {
		/*
      $hiddenClasses: Class that have property display: none or invisible.
    */
		function mb_trim($strin, $pos = 0, $len = 10000, $hiddenClasses = '', $encoding = 'utf-8') {
			mb_internal_encoding ( $encoding );
			$strout = trim ( $strin );
			
			$pattern = '/(<[^>]*>)/';
			$arr = preg_split ( $pattern, $strout, - 1, PREG_SPLIT_DELIM_CAPTURE );
			$left = $pos;
			$length = $len;
			$strout = '';
			for($i = 0; $i < count ( $arr ); $i ++) {
				$arr [$i] = trim ( $arr [$i] );
				if ($arr [$i] == '')
					continue;
				if ($i % 2 == 0) {
					if ($left > 0) {
						$t = $arr [$i];
						$arr [$i] = mb_substr ( $t, $left );
						$left -= (mb_strlen ( $t ) - mb_strlen ( $arr [$i] ));
					}
					
					if ($left <= 0) {
						if ($length > 0) {
							$t = $arr [$i];
							$arr [$i] = mb_substr ( $t, 0, $length );
							$length -= mb_strlen ( $arr [$i] );
							if ($length <= 0) {
								$arr [$i] .= '...';
							}
						
						} else {
							$arr [$i] = '';
						}
					}
				} else {
					if (SmartTrim::isHiddenTag ( $arr [$i], $hiddenClasses )) {
						if ($endTag = SmartTrim::getCloseTag ( $arr, $i )) {
							while ( $i < $endTag )
								$strout .= $arr [$i ++] . "\n";
						}
					}
				}
				$strout .= $arr [$i] . "\n";
			}
			//echo $strout;  
			return SmartTrim::toString ( $arr, $len );
		}
		
		function trim($strin, $pos = 0, $len = 10000, $hiddenClasses = '') {
			$strout = trim ( $strin );
			
			$pattern = '/(<[^>]*>)/';
			$arr = preg_split ( $pattern, $strout, - 1, PREG_SPLIT_DELIM_CAPTURE );
			$left = $pos;
			$length = $len;
			$strout = '';
			for($i = 0; $i < count ( $arr ); $i ++) {
				$arr [$i] = trim ( $arr [$i] );
				if ($arr [$i] == '')
					continue;
				if ($i % 2 == 0) {
					if ($left > 0) {
						$t = $arr [$i];
						$arr [$i] = substr ( $t, $left );
						$left -= (strlen ( $t ) - strlen ( $arr [$i] ));
					}
					
					if ($left <= 0) {
						if ($length > 0) {
							$t = $arr [$i];
							$arr [$i] = substr ( $t, 0, $length );
							
							$length -= strlen ( $arr [$i] );
							if ($length <= 0) {
								$arr [$i] .= '...';
							}
						
						} else {
							$arr [$i] = '';
						}
					}
				} else {
					if (SmartTrim::isHiddenTag ( $arr [$i], $hiddenClasses )) {
						if ($endTag = SmartTrim::getCloseTag ( $arr, $i )) {
							while ( $i < $endTag )
								$strout .= $arr [$i ++] . "\n";
						}
					}
				}
				$strout .= $arr [$i] . "\n";
			}
			//echo $strout;  
			return SmartTrim::toString ( $arr, $len );
		}
		
		function isHiddenTag($tag, $hiddenClasses = '') {
			//By pass full tag like img
			if (substr ( $tag, - 2 ) == '/>')
				return false;
			if (in_array ( SmartTrim::getTag ( $tag ), array ('script', 'style' ) ))
				return true;
			if (preg_match ( '/display\s*:\s*none/', $tag ))
				return true;
			if ($hiddenClasses && preg_match ( '/class\s*=[\s"\']*(' . $hiddenClasses . ')[\s"\']*/', $tag ))
				return true;
		}
		
		function getCloseTag($arr, $openidx) {
			$tag = trim ( $arr [$openidx] );
			if (! $openTag = SmartTrim::getTag ( $tag ))
				return 0;
			
			$endTag = "<$openTag>";
			$endidx = $openidx + 1;
			$i = 1;
			while ( $endidx < count ( $arr ) ) {
				if (trim ( $arr [$endidx] ) == $endTag)
					$i --;
				if (SmartTrim::getTag ( $arr [$endidx] ) == $openTag)
					$i ++;
				if ($i == 0)
					return $endidx;
				$endidx ++;
			}
			return 0;
		}
		
		function getTag($tag) {
			if (preg_match ( '/\A<([^\/>]*)\/>\Z/', trim ( $tag ), $matches ))
				return ''; //full tag
			if (preg_match ( '/\A<([^ \/>]*)([^>]*)>\Z/', trim ( $tag ), $matches )) {
				//echo "[".strtolower($matches[1])."]";
				return strtolower ( $matches [1] );
			}
			//if (preg_match ('/<([^ \/>]*)([^\/>]*)>/', trim($tag), $matches)) return strtolower($matches[1]);
			return '';
		}
		
		function toString($arr, $len) {
			$i = 0;
			$stack = new JAStack ();
			$length = 0;
			while ( $i < count ( $arr ) ) {
				$tag = trim ( $arr [$i ++] );
				if ($tag == '')
					continue;
				if (SmartTrim::isCloseTag ( $tag )) {
					if ($ltag = $stack->getLast ()) {
						if ('</' . SmartTrim::getTag ( $ltag ) . '>' == $tag)
							$stack->pop ();
						else
							$stack->push ( $tag );
					}
				} else if (SmartTrim::isOpenTag ( $tag )) {
					$stack->push ( $tag );
				} else if (SmartTrim::isFullTag ( $tag )) {
					//echo "[TAG: $tag, $length, $len]\n";
					if ($length < $len)
						$stack->push ( $tag );
				} else {
					$length += strlen ( $tag );
					$stack->push ( $tag );
				}
			}
			
			return $stack->toString ();
		}
		
		function isOpenTag($tag) {
			if (preg_match ( '/\A<([^\/>]+)\/>\Z/', trim ( $tag ), $matches ))
				return false; //full tag
			if (preg_match ( '/\A<([^ \/>]+)([^>]*)>\Z/', trim ( $tag ), $matches ))
				return true;
			return false;
		}
		
		function isFullTag($tag) {
			//echo "[Check full: $tag]\n";
			if (preg_match ( '/\A<([^\/>]*)\/>\Z/', trim ( $tag ), $matches ))
				return true; //full tag
			return false;
		}
		
		function isCloseTag($tag) {
			if (preg_match ( '/<\/(.*)>/', $tag ))
				return true;
			return false;
		}
	}
	
	class JAStack {
		var $_arr = null;
		function JAStack() {
			$this->_arr = array ();
		}
		
		function push($item) {
			$this->_arr [count ( $this->_arr )] = $item;
		}
		function pop() {
			if (! $c = count ( $this->_arr ))
				return null;
			$ret = $this->_arr [$c - 1];
			unset ( $this->_arr [$c - 1] );
			return $ret;
		}
		function getLast() {
			if (! $c = count ( $this->_arr ))
				return null;
			return $this->_arr [$c - 1];
		}
		function toString() {
			$output = '';
			foreach ( $this->_arr as $item ) {
				$output .= $item . "\n";
			}
			return $output;
		}
	}
}
?>