class RSI {
    getRSI6($list){
        // 首筆RSI
        let $startData = [$list[0],$list[1],$list[2],$list[3],$list[4],$list[5]];
        let $beforeUpAvg = this.getStartUpAvg($startData,6);
        let $beforeDownAvg = this.getStartDownAvg($startData,6);
        let $firstRSI6 = this.getRSI($beforeUpAvg,$beforeDownAvg);
        $list[5]['rsi6'] = $firstRSI6;

        let $length = $list.length;
        for (let $i=6; $i < $length; $i++) {
            let $minusU = 0;
            let $minusD = 0;
            let $minus = $list[$i]['c']-$list[$i-1]['c'];

            if($minus>0){
                $minusU = $minus;
            }else{
                $minusD = $minus;
            }

            $beforeUpAvg = $beforeUpAvg * 5 / 6 + ($minusU)/6;
            $beforeDownAvg = $beforeDownAvg * 5 / 6 + (Math.abs($minusD))/6;
            let $rsi6 = this.getRSI($beforeUpAvg,$beforeDownAvg);
            $list[$i]['rsi6'] = Math.round($rsi6*100)/100;
        }
        return $list;
    }

    getRSI12($list){
        
    }
    getStartUpAvg($startData,$number){
        let $sum = 0;
        for (let $i=1; $i < $startData.length; $i++) { 
            let $minus = $startData[$i]['c']-$startData[$i-1]['c'];
            if($minus>0){
                $sum += $minus;
            }
        }
        return $sum/$number;
    }
    getStartDownAvg($startData,$number){
        let $sum = 0;
        for (let $i=1; $i < $startData.length; $i++) { 
            let $minus = $startData[$i]['c']-$startData[$i-1]['c'];
            if($minus<0){
                $sum += $minus;
            }
        }
        return Math.abs($sum/$number);
    }
    getRSI($UpAvg,$DownAvg){
        if($UpAvg + $DownAvg!==0){
            let $response = $UpAvg / ( $UpAvg + $DownAvg ) * 100;
            return $response;
        }else{
            return 0;
        }
    }
}
module.exports = RSI;