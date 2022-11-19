export interface LineInfo{
  LayerName: string;
  Points : Point2D[];
  Draw : boolean;
  LineType : string;
}

export interface Point2D
{
  X : Number;
  Y : Number;
}
