<?php
$beanCount = R::count('transaction', "site=:site", [':site' => SITE]);
$beans = R::find('transaction', "site=:site ORDER BY `group` ASC", [':site' => SITE]);
$transactions = ['timestamp' => time(), 'object' => 'transactions', 'paged' => $paging->start > 0, 'nextpage' => $paging->last > $beanCount ? null : ('transactions/list/' . $paging->next), 'list' => []];
$groupTotals = [];

$payees = [];
$categories = [];

$exports = [];
$nonGroupId = 1;

foreach ($beans as $transaction) {
    if (!isset($categories[$transaction->category_id])) {
        $categories[$transaction->category_id] = R::load('category', $transaction->category_id);
    }
    if (!isset($payees[$transaction->payee_id])) {
        $payees[$transaction->payee_id] = R::load('payee', $transaction->payee_id);
    }
    $transaction->category = $categories[$transaction->category_id];
    $transaction->payee = $payees[$transaction->payee_id];

    if ($transaction->group != null) {
        if (!isset($groupTotals[$transaction->group])) $groupTotals[$transaction->group] = 0;
        $groupTotals[$transaction->group] += $transaction->amount;
    }


    $exportTrans = [
        'date' => strtotime($transaction->date),
        'amount' => 0,
        'payee' => $transaction->payee->name,
        'latitude' => $transaction->latitude,
        'longitude' => $transaction->longitude,
        'parity' => null,
        'splits' => []
    ];
    if ($transaction->group == null) {
        $exportTrans['amount'] = $transaction->amount;
        $exportTrans['parity'] = $transaction->category->parity;

        $exportTrans['splits'][] = [
            'amount' => $transaction->amount,
            'category' => $transaction->category->name,
            'description' => $transaction->description
        ];
        $exports['ng' . $nonGroupId++] = $exportTrans;
    } else {
        $groupId = $transaction->group;
        if (!isset($exports[$groupId])) {
            $exportTrans['parity'] = $transaction->category->parity;
            $exports[$groupId] = $exportTrans;
        } else if ($exports[$groupId]['parity'] != $transaction->category->parity) {
            $groupId .= "p{$transaction->category->parity}";
            $exportTrans['parity'] = $transaction->category->parity;
            $exports[$groupId] = $exportTrans;
        }
        $exports[$groupId]['splits'][] = [
            'amount' => $transaction->amount,
            'category' => $transaction->category->name,
            'description' => $transaction->description,
            'parity' => $transaction->category->parity
        ];
    }
}
foreach ($exports as $exportId => &$export) {
    if (count($export['splits']) > 1) {
        foreach ($export['splits'] as $split) {
            $export['amount'] += $split['amount'];
        }
        $export['amount'] = round($export['amount'], 2);
    }
}
jsonheader();
echo json_encode($exports, JSON_NUMERIC_CHECK);
exit();
