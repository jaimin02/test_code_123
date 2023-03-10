��v a r   C o n f i r m M e s s a g e   =   ' A r e   Y o u   S u r e   Y o u   W a n t   T o   E x i t   ? ' ;  
 v a r   v O p e r a t i o n C o d e = 0 ;  
 v a r   v O p e r a t i o n N a m e ;  
 v a r   v O p e r a t i o n P a t h ;  
 v a r   v P a r e n t O p e r a t i o n C o d e ;  
 v a r   i S e q N o ;  
  
 $ ( d o c u m e n t ) . r e a d y ( f u n c t i o n   ( )   {  
         n U s e r N o   =   n u l l ;  
         $ ( ' # O p e r a t i o n D e t a i l s M o d e l ' ) . m o d a l ( {  
                 b a c k d r o p :   ' s t a t i c ' ,  
                 k e y b o a r d :   f a l s e  
         } ) ;  
         $ ( ' # d i v A u d i t T r i a l ' ) . m o d a l ( {  
                 b a c k d r o p :   ' s t a t i c ' ,  
                 k e y b o a r d :   f a l s e  
         } ) ;  
         $ ( ' # O p e r a t i o n D e t a i l s M o d e l ' ) . m o d a l ( ' h i d e ' )  
         $ ( ' # d i v A u d i t T r i a l ' ) . m o d a l ( ' h i d e ' )  
         v P a r e n t O p e r a t i o n C o d e   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' d d l P a r e n t ' ) ;  
         v O p e r a t i o n N a m e   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t x t O p e a r a t i o n N a m e ' ) ;  
         v O p e r a t i o n P a t h   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t x t O p e r a t i o n P a t h ' ) ;  
         i S e q N o   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' t x t S e q u e n c e N o ' ) ;  
         G e t P a r e n t O p e r a t i o n L i s t ( ) ;  
         G e t O p e r a t i o n D e t a i l s ( ) ;  
 } ) ;  
  
 f u n c t i o n   G e t P a r e n t O p e r a t i o n L i s t ( )   {  
         j s o n D a t a   =   " " ;  
         v a r   E x e c u t e D a t a S e t D a t a   =   {  
                 T a b l e _ N a m e _ 1 :   " O p e r a t i o n M s t " ,  
                 W h e r e C o n d i t i o n _ 1 :   " c S t a t u s I n d i   < >   ' C ' " ,  
                 D a t a R e t r i e v a l _ 1 :   3 ,  
         }  
         G e t J s o n D a t a ( E x e c u t e D a t a S e t D a t a ) ;  
         $ ( " # d d l P a r e n t " ) . e m p t y ( ) . a p p e n d ( ' < o p t i o n   s e l e c t e d = " s e l e c t e d "   v a l u e = " " > P l e a s e   S e l e c t   P a r e n t   O p e r a t i o n < / o p t i o n > ' ) ;  
         f o r   ( v a r   i   =   0 ;   i   <   j s o n D a t a . l e n g t h ;   i + + )   {  
                 $ ( " # d d l P a r e n t " ) . a p p e n d ( $ ( " < o p t i o n > < / o p t i o n > " ) . v a l ( j s o n D a t a [ i ] . v O p e r a t i o n C o d e ) . h t m l ( j s o n D a t a [ i ] . v O p e r a t i o n N a m e ) ) ;  
         }  
 }  
  
 f u n c t i o n   G e t O p e r a t i o n D e t a i l s ( )   {  
         v a r   U r l   =   B a s e U r l   +   " R e c o r d F e t c h e r / E x e c u t e D a t a T a b l e " ;  
         v a r   E x e c u t e D a t a S e t D a t a   =   {  
                 T a b l e _ N a m e _ 1 :   " V i e w _ O p e r a t i o n M s t " ,  
                 / / W h e r e C o n d i t i o n _ 1 :   " c S t a t u s I n d i   < >   ' C ' " ,  
                 D a t a R e t r i e v a l _ 1 :   2 ,  
         }  
         G e t J s o n D a t a ( E x e c u t e D a t a S e t D a t a ) ;  
  
         v a r   A c t i v i t y D a t a s e t   =   [ ] ;  
         f o r   ( v a r   i   =   0 ;   i   <   j s o n D a t a . l e n g t h ;   i + + )   {  
                 v a r   I n D a t a s e t   =   [ ] ;  
                 I n D a t a s e t . p u s h ( j s o n D a t a [ i ] . v O p e r a t i o n N a m e ,   j s o n D a t a [ i ] . v O p e r a t i o n P a t h ,   j s o n D a t a [ i ] . v P a r e n t O p e r a t i o n N a m e ,   j s o n D a t a [ i ] . i S e q N o ,  
                 ' ' ,   ' ' ,   j s o n D a t a [ i ] . v O p e r a t i o n C o d e ,   j s o n D a t a [ i ] . v P a r e n t O p e r a t i o n C o d e ,   j s o n D a t a [ i ] . c S t a t u s I n d i ) ;  
                 A c t i v i t y D a t a s e t . p u s h ( I n D a t a s e t ) ;  
         }  
         j s o n D a t a   =   " " ;  
         v a r   o t a b l e S i t e D e t a i l s   =   $ ( ' # t b l O p e r a t i o n D e t a i l s D a t a ' ) . d a t a T a b l e ( {  
                 " b J Q u e r y U I " :   t r u e ,  
                 " s P a g i n a t i o n T y p e " :   " f u l l _ n u m b e r s " ,  
                 " b L e n g t h C h a n g e " :   t r u e ,  
                 " i D i s p l a y L e n g t h " :   1 0 ,  
                 " b P r o c e s s i n g " :   t r u e ,  
                 " b S o r t " :   t r u e ,  
                 " a u t o W i d t h " :   t r u e ,  
                 " a a D a t a " :   A c t i v i t y D a t a s e t ,  
                 " a a S o r t i n g " :   [ ] ,  
                 " b I n f o " :   t r u e ,  
                 " b A u t o W i d t h " :   f a l s e ,  
                 " b D e s t r o y " :   t r u e ,  
                 / / " s S c r o l l X " :   " 1 0 0 % " ,  
                 " f n C r e a t e d R o w " :   f u n c t i o n   ( n R o w ,   a D a t a ,   i D i s p l a y I n d e x ,   i D i s p l a y I n d e x F u l l )   {  
  
                         $ ( ' t d : e q ( 4 ) ' ,   n R o w ) . a p p e n d ( ' < c e n t e r > < a   d a t a - t o g g l e = " m o d a l "   t i t l e = " E d i t "   d a t a - o p t i o n s = " s p l a s h - 2   s p l a s h - e f - 1 5 "   d a t a - t a r g e t = " # O p e r a t i o n D e t a i l s M o d e l "   a t t r i d = " '   +   a D a t a [ 6 ]  
                         +   ' "   o n c l i c k = " O p e r a t i o n E d i t ( t h i s ) "   s t y l e = " c u r s o r : p o i n t e r ; "   v O p e r a t i o n N a m e = " '   +   a D a t a [ 0 ]   +   ' "   v O p e r a t i o n P a t h = " '   +   a D a t a [ 1 ]  
                         +   ' "   v P a r e n t O p e r a t i o n C o d e = " '   +   a D a t a [ 7 ]   +   ' "   i S e q N o = " '   +   a D a t a [ 3 ]   +   ' " v O p e r a t i o n C o d e = " ' +   a D a t a [ 6 ]  
                         +   ' "   c l a s s = " b t n   b t n - p r i m a r y   b t n - r o u n d e d   b t n - s m   b t n - e f   b t n - e f - 5   b t n - e f - 5 a   m b - 0 " > < i   c l a s s = " f a   f a - f w   f a - e d i t " > < / i > < s p a n > E d i t < / s p a n > < / a > < / c e n t e r > ' ) ;  
  
                         i f   ( a D a t a [ 8 ]   = =   ' C ' )   {  
                                 $ ( ' t d : e q ( 5 ) ' ,   n R o w ) . a p p e n d ( ' < c e n t e r > < a   t i t l e = " A c t i v e "   d a t a - t o g g l e = " m o d a l "   d a t a - o p t i o n s = " s p l a s h - 2   s p l a s h - e f - 1 5 "   d a t a - t a r g e t = " # O p e r a t i o n D e t a i l s M o d e l "   a t t r i d = " '   +   a D a t a [ 6 ]  
                                 +   ' "   o n c l i c k = " O p e r a t i o n A c t i v e I n a c t i v e ( t h i s ) "   s t y l e = " c u r s o r : p o i n t e r ; "   v O p e r a t i o n N a m e = " '   +   a D a t a [ 0 ]   +   ' "   v O p e r a t i o n P a t h = " '   +   a D a t a [ 1 ]  
                                 +   ' "   v P a r e n t O p e r a t i o n C o d e = " '   +   a D a t a [ 7 ]   +   ' "   i S e q N o = " '   +   a D a t a [ 3 ]   +   ' "   c S t a t u s I n d i = " '   +   a D a t a [ 8 ]   +   ' " v O p e r a t i o n C o d e = " ' +   a D a t a [ 6 ]  
                                 +   ' "   < i   c l a s s = " b t n   b t n - p r i m a r y   b t n - s m   b t n - r o u n d e d   b t n - e f   b t n - e f - 5   b t n - e f - 5 a   m b - 1 0 " > < i   c l a s s = " f a   f a - c h e c k - c i r c l e " > < / i >   < s p a n > A c t i v e < / s p a n > < / a > < / d i v > < / c e n t e r > ' ) ;  
                                 $ ( n R o w ) . a d d C l a s s ( ' h i g h l i g h t ' ) ;  
                                 $ ( ' t d ' ,   n R o w ) . e q ( 4 ) . a d d C l a s s ( ' d i s a b l e d ' ) ;  
                         }   e l s e   {  
                                 $ ( ' t d : e q ( 5 ) ' ,   n R o w ) . a p p e n d ( ' < c e n t e r > < a   t i t l e = " I n a c t i v e "   d a t a - t o g g l e = " m o d a l "   d a t a - o p t i o n s = " s p l a s h - 2   s p l a s h - e f - 1 5 "   d a t a - t a r g e t = " # O p e r a t i o n D e t a i l s M o d e l "   a t t r i d = " '   +   a D a t a [ 6 ]  
                               +   ' "   o n c l i c k = " O p e r a t i o n A c t i v e I n a c t i v e ( t h i s ) "   s t y l e = " c u r s o r : p o i n t e r ; "   v O p e r a t i o n N a m e = " '   +   a D a t a [ 0 ]   +   ' "   v O p e r a t i o n P a t h = " '   +   a D a t a [ 1 ]  
                               +   ' "   v P a r e n t O p e r a t i o n C o d e = " '   +   a D a t a [ 7 ]   +   ' "   i S e q N o = " '   +   a D a t a [ 3 ]   +   ' "   c S t a t u s I n d i = " '   +   a D a t a [ 8 ]   +   ' " v O p e r a t i o n C o d e = " '   + a D a t a [ 6 ]  
                               +   ' "   < i   c l a s s = " b t n   b t n - p r i m a r y   b t n - s m   b t n - r o u n d e d   b t n - e f   b t n - e f - 5   b t n - e f - 5 a   m b - 1 0 " > < i   c l a s s = " f a   f a - c l o s e " > < / i >   < s p a n > I n a c t i v e < / s p a n > < / a > < / d i v > < / c e n t e r > ' ) ;  
                         }  
  
                 } ,  
                 " c o l u m n D e f s " :   [  
                         {  
                                 " t a r g e t s " :   [ 6 ,   7 ,   8 ] ,  
                                 " v i s i b l e " :   f a l s e ,  
                                 " s e a r c h a b l e " :   f a l s e  
                         } ,  
  
                         {   " b S o r t a b l e " :   f a l s e ,   " t a r g e t s " :   4   } ,  
                         {   " b S o r t a b l e " :   f a l s e ,   " t a r g e t s " :   5   } ,  
                 ] ,  
                 " a o C o l u m n s " :   [  
                         {   " s T i t l e " :   " O p e r a t i o n   N a m e "   } ,  
                         {   " s T i t l e " :   " O p e r a t i o n   P a t h "   } ,  
                         {   " s T i t l e " :   " P a r e n t   O p e r a t i o n   N a m e "   } ,  
                         {   " s T i t l e " :   " S e q u e n c e   N o . "   } ,  
                         {   " s T i t l e " :   " E d i t "   } ,  
                         {   " s T i t l e " :   " I n a c t i v e "   } ,  
                 ] ,  
                 " o L a n g u a g e " :   {  
                         " s E m p t y T a b l e " :   " N o   R e c o r d   F o u n d " ,  
                 } ,  
         } ) ;  
  
 }  
  
 $ ( " # b t n A d d O p e r a t i o n " ) . o n ( " c l i c k " ,   f u n c t i o n   ( )   {  
         $ ( ' . f o r m - c o n t r o l ' ) . e a c h ( f u n c t i o n   ( )   {  
                 $ ( t h i s ) . a t t r ( ' d i s a b l e d ' ,   f a l s e ) ;  
                 i f   ( $ ( t h i s ) . h a s C l a s s ( " p a r s l e y - s u c c e s s " ) )   {  
                         $ ( t h i s ) . r e m o v e C l a s s ( " p a r s l e y - s u c c e s s " ) ;  
                 }  
                 e l s e   {  
                         i f   ( $ ( t h i s ) . h a s C l a s s ( " p a r s l e y - e r r o r " ) )   {  
                                 $ ( t h i s ) . r e m o v e C l a s s ( " p a r s l e y - e r r o r " )  
                         }  
                         i f   ( $ ( t h i s ) . n e x t ( ) . h a s C l a s s ( " f i l l e d " ) )   {  
                                 $ ( t h i s ) . n e x t ( ) . r e m o v e C l a s s ( " f i l l e d " )  
                         }  
                 }  
         } ) ;  
  
         $ ( ' . A u d i t C o n t r o l ' ) . e a c h ( f u n c t i o n   ( )   {   t h i s . s t y l e . d i s p l a y   =   " n o n e " ;   } ) ;  
         $ ( " # t i t l e M o d e " ) . t e x t ( ' M o d e : - A d d ' ) ;  
         C l e a r T e x t B o x D e t a i l P a r t ( ) ;  
         d o c u m e n t . g e t E l e m e n t B y I d ( " b t n S a v e O p e r a t i o n D e t a i l s " ) . v a l u e   =   " S a v e "  
         d o c u m e n t . g e t E l e m e n t B y I d ( " b t n S a v e O p e r a t i o n D e t a i l s " ) . t i t l e   =   " S a v e " ;  
         $ ( " # b t n S a v e O p e r a t i o n D e t a i l s " ) . a t t r ( " d i s a b l e d " ,   t r u e ) ;  
         $ ( " # b t n S a v e O p e r a t i o n D e t a i l s " ) . a t t r ( " s t y l e " ,   " d i s p l a y : i n l i n e " ) ;  
         $ ( " # b t n C l e a r O p e r a t i o n D e t a i l s " ) . a t t r ( " s t y l e " ,   " d i s p l a y : i n l i n e " ) ;  
 } ) ;  
  
 $ ( " # b t n S a v e O p e r a t i o n D e t a i l s " ) . o n ( " c l i c k " ,   f u n c t i o n   ( )   {  
         i f   ( v a l i d a t e f o r m ( )   = =   f a l s e )   {  
                 r e t u r n   f a l s e ;  
         }  
         v a r   O p e r a t i o n ;  
         v a r   b t n O p e r a i o n   =   ( d o c u m e n t . g e t E l e m e n t B y I d ( " b t n S a v e O p e r a t i o n D e t a i l s " ) . v a l u e ) . t o L o w e r C a s e ( ) ;  
  
         i f   ( b t n O p e r a i o n   = =   " s a v e " )   {  
  
                 O p e r a t i o n   =   1 ;  
                 v a r   S a v e O p e r a t i o n M a s t e r D a t a   =   {  
                         v O p e r a t i o n C o d e :   d o c u m e n t . g e t E l e m e n t B y I d ( " t x t O p e t a t i o n C o d e " ) . v a l u e ,  
                         v O p e r a t i o n N a m e :   v O p e r a t i o n N a m e . v a l u e ,  
                         v O p e r a t i o n P a t h :   v O p e r a t i o n P a t h . v a l u e ,  
                         v P a r e n t O p e r a t i o n C o d e :   $ ( v P a r e n t O p e r a t i o n C o d e ) . v a l ( ) ,  
                         i S e q N o :   i S e q N o . v a l u e ,  
                         i M o d i f y B y :   d o c u m e n t . g e t E l e m e n t B y I d ( ' h d n u s e r i d ' ) . v a l u e ,  
                         c S t a t u s I n d i :   ' N ' ,  
                         D A T A O P M O D E :   O p e r a t i o n  
                 }  
                 S a v e O p e r a t i o n M a s t e r ( B a s e U r l   +   " P m s O p e r a t i o n M a s t e r / s a v e _ O p e r a t i o n M a s t e r " ,   " S u c c e s s M e t h o d " ,   S a v e O p e r a t i o n M a s t e r D a t a ) ;  
         }  
         e l s e   {  
                 O p e r a t i o n   =   2 ;  
                 v a r   S a v e O p e r a t i o n M a s t e r D a t a   =   {  
                         v O p e r a t i o n C o d e :   v O p e r a t i o n C o d e ,  
                         v O p e r a t i o n N a m e :   v O p e r a t i o n N a m e . v a l u e ,  
                         v O p e r a t i o n P a t h :   v O p e r a t i o n P a t h . v a l u e ,  
                         v P a r e n t O p e r a t i o n C o d e :   $ ( v P a r e n t O p e r a t i o n C o d e ) . v a l ( ) ,  
                         i S e q N o :   i S e q N o . v a l u e ,  
                         i M o d i f y B y :   d o c u m e n t . g e t E l e m e n t B y I d ( ' h d n u s e r i d ' ) . v a l u e ,  
                         c S t a t u s I n d i :   ' E ' ,  
                         D A T A O P M O D E :   O p e r a t i o n  
                 }  
                 i f   ( b t n O p e r a i o n   = =   " i n a c t i v e " )   {  
                         S a v e O p e r a t i o n M a s t e r D a t a [ " c S t a t u s I n d i " ]   =   " C " ;  
                         S a v e O p e r a t i o n M a s t e r D a t a [ " D A T A O P M O D E " ]   =   3 ;  
                 }  
                 S a v e O p e r a t i o n M a s t e r ( B a s e U r l   +   " P m s O p e r a t i o n M a s t e r / s a v e _ O p e r a t i o n M a s t e r " ,   " S u c c e s s M e t h o d " ,   S a v e O p e r a t i o n M a s t e r D a t a ) ;  
         }  
         C l e a r T e x t B o x D e t a i l P a r t ( ) ;  
         $ ( " # O p e r a t i o n D e t a i l s M o d e l " ) . m o d a l ( ' h i d e ' ) ;  
         G e t P a r e n t O p e r a t i o n L i s t ( ) ;  
         G e t O p e r a t i o n D e t a i l s ( ) ;  
 } ) ;  
  
 $ ( " # b t n C l e a r O p e r a t i o n D e t a i l s " ) . o n ( " c l i c k " ,   f u n c t i o n   ( )   {  
         C l e a r T e x t B o x D e t a i l P a r t ( ) ;  
 } ) ;  
  
 $ ( " # b t n E x i t O p e r a t i o n D e t a i l s " ) . o n ( " c l i c k " ,   f u n c t i o n   ( )   {  
         v a r   r e s u l t   =   c o n f i r m ( C o n f i r m M e s s a g e ) ;  
         i f   ( r e s u l t )   {  
                 $ ( " # O p e r a t i o n D e t a i l s M o d e l " ) . m o d a l ( ' h i d e ' ) ;  
         }  
         e l s e   {  
                 r e t u r n   f a l s e ;  
         }  
 } ) ;  
  
 f u n c t i o n   C l e a r T e x t B o x D e t a i l P a r t ( )   {  
         i S e q N o . v a l u e   =   " " ;  
         $ ( v P a r e n t O p e r a t i o n C o d e ) . v a l ( " " ) ;  
         $ ( ' # b t n S a v e O p e r a t i o n D e t a i l s ' ) . p r o p ( ' d i s a b l e d ' ,   t r u e ) ;  
         i f   ( ( $ ( " # t i t l e M o d e " ) . t e x t ( ) . s p l i t ( ' - ' ) [ 1 ] . s p l i t ( ' " ' ) [ 0 ] . t o S t r i n g ( ) . r e p l a c e ( / \ s + / g ,   ' ' )   = =   " A d d " ) )   {  
                 $ ( " # t x t O p e a r a t i o n N a m e " ) . v a l ( " " ) ;  
                 $ ( " # t x t O p e r a t i o n P a t h " ) . v a l ( " " ) ;  
                 $ ( " # t x t O p e t a t i o n C o d e " ) . v a l ( " " ) ;  
         }  
         $ ( ' . f o r m - c o n t r o l ' ) . e a c h ( f u n c t i o n   ( )   {  
                 i f   ( $ ( t h i s ) . h a s C l a s s ( " p a r s l e y - s u c c e s s " ) )   {  
                         $ ( t h i s ) . r e m o v e C l a s s ( " p a r s l e y - s u c c e s s " ) ;  
                 }  
                 e l s e   {  
                         i f   ( $ ( t h i s ) . h a s C l a s s ( " p a r s l e y - e r r o r " ) )   {  
                                 $ ( t h i s ) . r e m o v e C l a s s ( " p a r s l e y - e r r o r " )  
                         }  
                         i f   ( $ ( t h i s ) . n e x t ( ) . h a s C l a s s ( " f i l l e d " ) )   {  
                                 $ ( t h i s ) . n e x t ( ) . r e m o v e C l a s s ( " f i l l e d " )  
                         }  
                 }  
         } ) ;  
 }  
  
 f u n c t i o n   v a l i d a t e f o r m ( )   {  
  
         v a r   r o w s   =   $ ( " # t b l O p e r a t i o n D e t a i l s D a t a " ) . d a t a T a b l e ( ) . f n G e t N o d e s ( ) ;  
         f o r   ( i   =   0 ;   i   <   r o w s . l e n g t h ;   i + + )   {  
                 i f   ( v O p e r a t i o n N a m e . v a l u e . t o U p p e r C a s e ( )   = =   $ ( r o w s [ i ] ) . f i n d ( " t d : e q ( 0 ) " ) . h t m l ( ) . t r i m ( ) . t o U p p e r C a s e ( ) )   {  
                         i f   ( $ ( r o w s [ i ] ) . f i n d ( " t d : e q ( 4 ) " ) . f i n d ( " a " ) . a t t r ( " a t t r i d " )   ! =   v O p e r a t i o n C o d e )   {  
                                 a l e r t ( " T h i s   O p e r a t i o n   N a m e   a l r e a d y   e x i s t   i n   s y s t e m . " )  
                                 r e t u r n   f a l s e ;  
                                 b r e a k ;  
                         }  
                 }  
         }  
         v a r   E x e c u t e D a t a S e t D a t a   =   {  
                 T a b l e _ N a m e _ 1 :   " O p e r a t i o n M s t " ,  
                 W h e r e C o n d i t i o n _ 1 :   " v P a r e n t O p e r a t i o n C o d e = "   +   $ ( v P a r e n t O p e r a t i o n C o d e ) . v a l ( )   +   "   A N D   i S e q N o = "   +   i S e q N o . v a l u e   +   "   A N D   v O p e r a t i o n C o d e < > "   +   v O p e r a t i o n C o d e ,  
                 D a t a R e t r i e v a l _ 1 :   3 ,  
         }  
         G e t J s o n D a t a ( E x e c u t e D a t a S e t D a t a ) ;  
         i f   ( j s o n D a t a . l e n g t h   >   0 )   {  
                 / / a l e r t ( " S e q u e n c e   N o .   a l r e a d y   e x i s t   i n   s y s t e m . " )  
               / /   r e t u r n   f a l s e ;  
         }  
         r e t u r n   t r u e ;  
 }  
  
 v a r   S a v e O p e r a t i o n M a s t e r   =   f u n c t i o n   ( U r l ,   S u c c e s s M e t h o d ,   D a t a )   {  
         $ . a j a x ( {  
                 u r l :   U r l ,  
                 t y p e :   ' P O S T ' ,  
                 d a t a :   D a t a ,  
                 a s y n c :   f a l s e ,  
                 s u c c e s s :   S u c c e s s I n s e r t D a t a ,  
                 e r r o r :   f u n c t i o n   ( )   {  
                         a l e r t ( " E r r o r   w h i l e   s a v i n g   d e t a i l s   o f   U s e r   M a s t e r s . " ) ;  
                 }  
         } ) ;  
  
         f u n c t i o n   S u c c e s s I n s e r t D a t a ( r e s p o n s e )   {  
                 a l e r t ( r e s p o n s e ) ;  
         }  
 } ;  
  
 f u n c t i o n   O p e r a t i o n E d i t ( e )   {  
         $ ( ' . f o r m - c o n t r o l ' ) . e a c h ( f u n c t i o n   ( )   {  
                 $ ( t h i s ) . a t t r ( ' d i s a b l e d ' ,   f a l s e ) ;  
                 i f   ( $ ( t h i s ) . h a s C l a s s ( " p a r s l e y - s u c c e s s " ) )   {  
                         $ ( t h i s ) . r e m o v e C l a s s ( " p a r s l e y - s u c c e s s " ) ;  
                 }  
                 e l s e   {  
                         i f   ( $ ( t h i s ) . h a s C l a s s ( " p a r s l e y - e r r o r " ) )   {  
                                 $ ( t h i s ) . r e m o v e C l a s s ( " p a r s l e y - e r r o r " )  
                         }  
                         i f   ( $ ( t h i s ) . n e x t ( ) . h a s C l a s s ( " f i l l e d " ) )   {  
                                 $ ( t h i s ) . n e x t ( ) . r e m o v e C l a s s ( " f i l l e d " )  
                         }  
                 }  
         } ) ;  
         $ ( ' . A u d i t C o n t r o l ' ) . e a c h ( f u n c t i o n   ( )   {   t h i s . s t y l e . d i s p l a y   =   " n o n e " ;   } ) ;  
         $ ( " # t i t l e M o d e " ) . t e x t ( ' M o d e : - E d i t ' ) ;  
         v O p e r a t i o n C o d e   =   $ ( e ) . a t t r ( " a t t r i d " ) ;  
         d o c u m e n t . g e t E l e m e n t B y I d ( ' t x t O p e t a t i o n C o d e ' ) . v a l u e   =   v O p e r a t i o n C o d e ;  
         $ ( v O p e r a t i o n N a m e ) . v a l ( $ ( e ) . a t t r ( " v O p e r a t i o n N a m e " ) ) ;  
         $ ( " # t x t O p e a r a t i o n N a m e " ) . p r o p ( ' d i s a b l e d ' ,   ' d i s a b l e d ' ) ;  
         $ ( " # t x t O p e r a t i o n P a t h " ) . p r o p ( ' d i s a b l e d ' ,   ' d i s a b l e d ' ) ;  
         $ ( " # t x t O p e t a t i o n C o d e " ) . p r o p ( ' d i s a b l e d ' ,   ' d i s a b l e d ' ) ;      
         $ ( v O p e r a t i o n P a t h ) . v a l ( $ ( e ) . a t t r ( " v O p e r a t i o n P a t h " ) ) ;  
         $ ( i S e q N o ) . v a l ( $ ( e ) . a t t r ( " i S e q N o " ) ) ;  
         $ ( v P a r e n t O p e r a t i o n C o d e ) . v a l ( $ ( e ) . a t t r ( " v P a r e n t O p e r a t i o n C o d e " ) ) ;  
         d o c u m e n t . g e t E l e m e n t B y I d ( " b t n S a v e O p e r a t i o n D e t a i l s " ) . v a l u e   =   " U p d a t e " ;  
         d o c u m e n t . g e t E l e m e n t B y I d ( " b t n S a v e O p e r a t i o n D e t a i l s " ) . t i t l e   =   " U p d a t e " ;  
         $ ( " # b t n S a v e O p e r a t i o n D e t a i l s " ) . a t t r ( " d i s a b l e d " ,   t r u e ) ;  
         $ ( " # b t n S a v e O p e r a t i o n D e t a i l s " ) . a t t r ( " s t y l e " ,   " d i s p l a y : i n l i n e " ) ;  
         $ ( " # b t n C l e a r O p e r a t i o n D e t a i l s " ) . a t t r ( " s t y l e " ,   " d i s p l a y : i n l i n e " ) ;  
 }  
  
 f u n c t i o n   O p e r a t i o n A c t i v e I n a c t i v e ( e )   {  
         $ ( ' . f o r m - c o n t r o l ' ) . e a c h ( f u n c t i o n   ( )   {  
                 $ ( t h i s ) . a t t r ( ' d i s a b l e d ' ,   t r u e ) ;  
                 i f   ( $ ( t h i s ) . h a s C l a s s ( " p a r s l e y - s u c c e s s " ) )   {  
                         $ ( t h i s ) . r e m o v e C l a s s ( " p a r s l e y - s u c c e s s " ) ;  
                 }  
         } ) ;  
         $ ( ' . A u d i t C o n t r o l ' ) . e a c h ( f u n c t i o n   ( )   {   t h i s . s t y l e . d i s p l a y   =   " n o n e " ;   } ) ;  
  
         v O p e r a t i o n C o d e   =   $ ( e ) . a t t r ( " a t t r i d " ) ;  
         $ ( v O p e r a t i o n N a m e ) . v a l ( $ ( e ) . a t t r ( " v O p e r a t i o n N a m e " ) ) ;  
         $ ( v O p e r a t i o n P a t h ) . v a l ( $ ( e ) . a t t r ( " v O p e r a t i o n P a t h " ) ) ;  
         $ ( i S e q N o ) . v a l ( $ ( e ) . a t t r ( " i S e q N o " ) ) ;  
         $ ( v P a r e n t O p e r a t i o n C o d e ) . v a l ( $ ( e ) . a t t r ( " v P a r e n t O p e r a t i o n C o d e " ) ) ;  
         i f   ( e . p a r e n t N o d e . i n n e r T e x t . t o L o w e r C a s e ( )   = =   " a c t i v e " )   {  
                 $ ( " # t i t l e M o d e " ) . t e x t ( ' M o d e : - A c t i v e ' ) ;  
                 d o c u m e n t . g e t E l e m e n t B y I d ( " b t n S a v e O p e r a t i o n D e t a i l s " ) . v a l u e   =   " A c t i v e "  
                 d o c u m e n t . g e t E l e m e n t B y I d ( " b t n S a v e O p e r a t i o n D e t a i l s " ) . t i t l e   =   " A c t i v e " ;  
         }  
         e l s e   {  
                 $ ( " # t i t l e M o d e " ) . t e x t ( ' M o d e : - I n a c t i v e ' ) ;  
                 d o c u m e n t . g e t E l e m e n t B y I d ( " b t n S a v e O p e r a t i o n D e t a i l s " ) . v a l u e   =   " I n a c t i v e "  
                 d o c u m e n t . g e t E l e m e n t B y I d ( " b t n S a v e O p e r a t i o n D e t a i l s " ) . t i t l e   =   " I n a c t i v e " ;  
         }  
         $ ( " # b t n S a v e O p e r a t i o n D e t a i l s " ) . a t t r ( " d i s a b l e d " ,   f a l s e ) ;  
         $ ( " # b t n S a v e O p e r a t i o n D e t a i l s " ) . a t t r ( " s t y l e " ,   " d i s p l a y : i n l i n e " ) ;  
         $ ( " # b t n C l e a r O p e r a t i o n D e t a i l s " ) . a t t r ( " s t y l e " ,   " d i s p l a y : n o n e " ) ;  
 }  
  
 