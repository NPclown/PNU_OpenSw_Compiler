public class Circle extends Shape{
 
    public Circle(String name, int r){
        super(name, r);
    }
     
    @Override
    public void area(){
        area= (int)((r*r)*PI);
        super.area();
    }
}


