first drafts

to zero a byte in a bytes32
note that for a byte X, X AND !X = 0, and X AND 1 = X.
so for a sequence of bytes {X_1, X_2, ..., X_n},
[X_1, X_2, \dots, X_i, /dots, X_n] AND [1, 1, \dots, !X_i, \dots, 1]
= [X_1, X_2, \dots, 0, \dots, X_n]

!(0 Y 0) = 1 !Y 1