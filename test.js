function bdMap_to_txMap($lat, $lng) {
  $x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  $x = $lng - 0.0065;
  $y = $lat - 0.006;
  $z = sqrt($x * $x + $y * $y) - 0.00002 * sin($y * $x_pi);
  $theta = atan2($y, $x) - 0.000003 * cos($x * $x_pi);
  $lng = $z * cos($theta);
  $lat = $z * sin($theta);
  return array('lng' => $lng, 'lat' => $lat);
}
var arr = bdMap_to_txMap(121.11068229794456， 31.14611982960413)
console.log(arr)